import SidebarNav from "@/components/account/sidebar-nav";
import { EducationForm } from "@/components/forms/profile/education-form";
import { PersonalInfoForm } from "@/components/forms/profile/personal-info-form";
import type { FormType } from "@/components/forms/profile/types";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { type CVProfileInput, getUserProfile, updateUserProfile } from "@/lib/supabase/documents/profile";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import { type ActionFunctionArgs, type LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useActionData, useLoaderData, useNavigation, useSearchParams } from "@remix-run/react";
import type { Json } from "db_types";
import { Briefcase, CheckCircle2, Folder, GraduationCap, User, Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

type ActionData = {
	success?: boolean;
	error?: string;
	message?: string;
	noNavigate?: boolean;
};

type Education = {
	school: string;
	degree: string;
	startDate: string;
	endDate: string;
	location?: string;
	description?: string;
};

type ProfileData = {
	first_name: string | null;
	last_name: string | null;
	email: string | null;
	phone: string | null;
	address: string | null;
	linkedin: string | null;
	github: string | null;
	website: string | null;
	education?: Education | null;
	experience?: Json | null;
	projects?: Json | null;
	skills?: string[] | null;
	completion?: Json | null;
};

type LoaderData = {
	profile: ProfileData | null;
};

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

		const profile: ProfileData = {
			...dbProfile,
			education: dbProfile.education as unknown as Education,
		};

		return json<LoaderData>({ profile }, { headers });
	} catch (error) {
		return json<LoaderData>({ profile: null }, { headers });
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
					profile: updatedProfile as CVProfileInput,
				});
			} catch (error) {
				console.log(error);
				return json<ActionData>({ message: "Failed to update profile", success: false });
			}

			return json<ActionData>({ success: true, noNavigate }, { headers });
		}
		case "education": {
			const educations = formData.get("educations");
			try {
				await updateUserProfile({
					supabase,
					profile: {
						education: educations as unknown as Json,
					},
				});
			} catch (error) {
				console.log(error);
				return json<ActionData>({ message: "Failed to update education", success: false });
			}

			return json<ActionData>({ success: true, noNavigate }, { headers });
		}
		case "experience":
			// TODO: Implement experience form submission
			return json<ActionData>({ success: true, noNavigate }, { headers });
		case "skills":
			// TODO: Implement skills form submission
			return json<ActionData>({ success: true, noNavigate }, { headers });
		case "projects":
			// TODO: Implement projects form submission
			return json<ActionData>({ success: true, noNavigate }, { headers });
		default:
			return json<ActionData>({ error: "Invalid form type" }, { status: 400, headers });
	}
}

export default function Profile() {
	const actionData = useActionData<typeof action>();
	const { profile } = useLoaderData<typeof loader>();
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";
	const [searchParams, setSearchParams] = useSearchParams();
	const sectionParam = searchParams.get("section") as FormType | null;
	const [selectedTab, setSelectedTab] = useState<FormType>(sectionParam ?? "personal");

	const sectionOrder: FormType[] = ["personal", "education", "experience", "skills", "projects"];
	const currentIndex = sectionOrder.indexOf(selectedTab);
	const nextSection = currentIndex < sectionOrder.length - 1 ? sectionOrder[currentIndex + 1] : null;

	const completionPercentage = useMemo(() => {
		return (
			(sectionOrder.reduce((acc, section) => {
				return acc + (checkSectionCompletion(section) ? 1 : 0);
			}, 0) /
				sectionOrder.length) *
			100
		);
	}, [sectionOrder]);

	const handleNext = () => {
		if (nextSection) {
			setSelectedTab(nextSection);
			setSearchParams({ section: nextSection });
		}
	};

	useEffect(() => {
		if (sectionParam && ["personal", "education", "experience", "skills", "projects"].includes(sectionParam)) {
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

	function checkSectionCompletion(section: FormType): boolean {
		if (!profile) return false;

		switch (section) {
			case "personal":
				return Boolean(profile.first_name && profile.last_name && profile.email && profile.phone);
			case "education":
				return Boolean(
					profile.education?.school &&
						profile.education?.degree &&
						profile.education?.startDate &&
						profile.education?.endDate,
				);
			case "experience":
				// TODO: Implement experience completion check
				return false;
			case "skills":
				// TODO: Implement skills completion check
				return false;
			case "projects":
				// TODO: Implement projects completion check
				return false;
			default:
				return false;
		}
	}

	const sidebarItems = [
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
			title: "Skills",
			id: "skills",
			icon: <Wrench size={18} />,
		},
		{
			title: "Projects",
			id: "projects",
			icon: <Folder size={18} />,
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
							const isCompleted = checkSectionCompletion(item.id as FormType);
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
							wasCompleted={checkSectionCompletion("personal")}
						/>
					)}
					{selectedTab === "education" && (
						<EducationForm
							defaultValues={{
								educations: [
									{
										school: profile?.education?.school || "",
										degree: profile?.education?.degree || "",
										startDate: profile?.education?.startDate || "",
										endDate: profile?.education?.endDate || "",
										location: profile?.education?.location || "",
										description: [profile?.education?.description || ""],
									},
								],
							}}
							isSubmitting={isSubmitting}
							formType={selectedTab}
							wasCompleted={checkSectionCompletion("education")}
						/>
					)}
					{/* TODO: Add other form components */}
				</main>
			</div>
		</div>
	);
}
