import SidebarNav from "@/components/account/sidebar-nav";
import { EducationForm } from "@/components/forms/profile/education-form";
import { ExperienceForm } from "@/components/forms/profile/experience-form";
import type { CVProfileInput, FormType, ParsedCVProfile } from "@/components/forms/profile/logic/types";
import { ensureValidProfile } from "@/components/forms/profile/logic/types";
import {
	checkSectionCompletion,
	getEducationFormData,
	getExperienceFormData,
	getProjectsFormData,
	getSkillsFormData,
} from "@/components/forms/profile/logic/utils";
import { PersonalInfoForm } from "@/components/forms/profile/personal-info-form";
import { ProjectsForm } from "@/components/forms/profile/projects-form";
import { SkillsForm } from "@/components/forms/profile/skills-form";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getUserProfile, updateUserProfile } from "@/lib/supabase/documents/profile";
import { handleProfileSectionUpdate } from "@/lib/supabase/profile-action-helpers";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { type ActionFunctionArgs, type LoaderFunctionArgs, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import { Briefcase, CheckCircle2, Folder, GraduationCap, User, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase, headers } = getSupabaseWithHeaders({ request });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		throw redirect("/login", { headers });
	}

	try {
		const dbProfile = await getUserProfile({ supabase });
		return new Response(JSON.stringify({ profile: dbProfile }), {
			headers: {
				...headers,
				"Content-Type": "application/json",
			},
		});
	} catch (error) {
		console.error("Error loading profile:", error);
		return new Response(JSON.stringify({ profile: ensureValidProfile(null) }), {
			headers: {
				...headers,
				"Content-Type": "application/json",
			},
		});
	}
}

export async function action({ request }: ActionFunctionArgs) {
	const { supabase, headers } = getSupabaseWithHeaders({ request });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	if (!session?.user) {
		throw redirect("/login", { headers });
	}

	const formData = await request.formData();
	const formType = formData.get("formType") as FormType;
	const noNavigate = !!formData.get("saveChanges");

	switch (formType) {
		case "personal": {
			const updatedProfile: Partial<CVProfileInput> = {
				first_name: formData.get("firstName") as string,
				last_name: formData.get("lastName") as string,
				email: formData.get("email") as string,
				phone: formData.get("phone") as string,
				address: formData.get("address") as string,
				linkedin: formData.get("linkedin") as string,
				github: formData.get("github") as string,
				website: formData.get("website") as string,
			};
			try {
				await updateUserProfile({
					supabase,
					profile: updatedProfile,
				});
			} catch (error) {
				console.error("Failed to update profile:", error);
				return new Response(JSON.stringify({ message: "Failed to update profile", success: false }), {
					headers: { "Content-Type": "application/json" },
				});
			}

			return new Response(JSON.stringify({ success: true, noNavigate }), {
				headers: {
					...headers,
					"Content-Type": "application/json",
				},
			});
		}
		case "education":
			return handleProfileSectionUpdate({
				supabase,
				headers,
				formData,
				sectionKey: "education",
				formKey: "educations",
			});
		case "experience":
			return handleProfileSectionUpdate({
				supabase,
				headers,
				formData,
				sectionKey: "experience",
				formKey: "experiences",
			});
		case "projects":
			return handleProfileSectionUpdate({
				supabase,
				headers,
				formData,
				sectionKey: "projects",
				formKey: "projects",
			});
		case "skills":
			return handleProfileSectionUpdate({
				supabase,
				headers,
				formData,
				sectionKey: "skills",
				formKey: "skills",
			});
		default:
			return new Response(JSON.stringify({ error: "Invalid form type" }), {
				headers: {
					...headers,
					"Content-Type": "application/json",
				},
			});
	}
}

export default function Profile() {
	const actionData = useActionData<typeof action>();
	const { profile: rawProfile } = useLoaderData<typeof loader>() as { profile: ParsedCVProfile };
	const profile = ensureValidProfile(rawProfile);
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";
	const [searchParams, setSearchParams] = useSearchParams();
	const sectionParam = searchParams.get("section") as FormType | null;
	const [selectedTab, setSelectedTab] = useState<FormType>(sectionParam ?? "personal");

	const sectionOrder: FormType[] = ["personal", "education", "experience", "projects", "skills"];
	const currentIndex = sectionOrder.indexOf(selectedTab);
	const nextSection = currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;

	const completionPercentage = useMemo(() => {
		return (
			(sectionOrder.reduce((acc, section) => {
				return acc + (checkSectionCompletion(profile, section) ? 1 : 0);
			}, 0) /
				sectionOrder.length) *
			100
		);
	}, [profile, sectionOrder]);

	const handleNext = () => {
		if (nextSection) {
			setSelectedTab(nextSection);
			setSearchParams({ section: nextSection });
		}
	};

	useEffect(() => {
		if (sectionParam && sectionOrder.includes(sectionParam)) {
			setSelectedTab(sectionParam);
		}
	}, [sectionParam]);

	useEffect(() => {
		if (actionData) {
			if (actionData.success) {
				toast.success("Profile updated successfully");
				if (!actionData.noNavigate) handleNext();
			} else if (actionData.message) toast.error(actionData.message);
		}
	}, [actionData]);

	const sidebarItems: { title: string; id: FormType; icon: JSX.Element }[] = [
		{
			title: "Personal Info",
			id: "personal",
			icon: <User size={18} />,
		},
		{
			title: "Education",
			id: "education",
			icon: <GraduationCap size={18} />,
		},
		{
			title: "Experience",
			id: "experience",
			icon: <Briefcase size={18} />,
		},
		{
			title: "Projects",
			id: "projects",
			icon: <Folder size={18} />,
		},
		{
			title: "Skills",
			id: "skills",
			icon: <Wrench size={18} />,
		},
	];

	const handleSelect = (id: string) => {
		setSelectedTab(id as FormType);
		setSearchParams({ section: id });
	};

	return (
		<div className="flex flex-col gap-4">
			<CardHeader className="p-2">
				<CardTitle className="text-3xl font-bold">Profile</CardTitle>
				<CardDescription>Complete your profile information to create a professional CV</CardDescription>
			</CardHeader>

			<div>
				<div className="flex items-center justify-between mb-2">
					<span className="text-sm font-medium text-gray-700">Profile completion</span>
					<span className="text-sm font-medium text-gray-700">{completionPercentage.toFixed(0)}%</span>
				</div>
				<Progress value={completionPercentage} className="my-1 lg:my-2" />
			</div>

			<div className="grid flex-1 gap-12 md:grid-cols-[200px_1fr]">
				<aside className="md:w-[200px] flex-col md:flex">
					<SidebarNav
						items={sidebarItems.map((item) => {
							const isCompleted = checkSectionCompletion(profile, item.id as FormType);
							return {
								...item,
								title: (
									<div className="flex items-center gap-2">
										<span>{item.title}</span>
										{isCompleted && <CheckCircle2 className="h-4 w-4 text-green-500" />}
									</div>
								),
							};
						})}
						selectedItem={selectedTab}
						onSelectItem={handleSelect}
						useNavigation={false}
					/>
				</aside>
				<main className="flex w-full flex-col overflow-hidden">
					{selectedTab === "personal" && (
						<PersonalInfoForm
							defaultValues={{
								firstName: profile?.first_name || "",
								lastName: profile?.last_name || "",
								email: profile?.email || "",
								phone: profile?.phone || "",
								address: profile?.address || "",
								linkedin: profile?.linkedin || "",
								github: profile?.github || "",
								website: profile?.website || "",
							}}
							isSubmitting={isSubmitting}
							formType={selectedTab}
							wasCompleted={checkSectionCompletion(profile, "personal")}
						/>
					)}
					{selectedTab === "education" && (
						<EducationForm
							defaultValues={getEducationFormData(profile)}
							isSubmitting={isSubmitting}
							formType={selectedTab}
							wasCompleted={checkSectionCompletion(profile, "education")}
						/>
					)}
					{selectedTab === "experience" && (
						<ExperienceForm
							defaultValues={getExperienceFormData(profile)}
							isSubmitting={isSubmitting}
							formType={selectedTab}
							wasCompleted={checkSectionCompletion(profile, "experience")}
						/>
					)}
					{selectedTab === "projects" && (
						<ProjectsForm
							defaultValues={getProjectsFormData(profile)}
							isSubmitting={isSubmitting}
							formType={selectedTab}
							wasCompleted={checkSectionCompletion(profile, "projects")}
						/>
					)}
					{selectedTab === "skills" && (
						<SkillsForm
							defaultValues={getSkillsFormData(profile)}
							isSubmitting={isSubmitting}
							formType={selectedTab}
							wasCompleted={checkSectionCompletion(profile, "skills")}
						/>
					)}
				</main>
			</div>
		</div>
	);
}
