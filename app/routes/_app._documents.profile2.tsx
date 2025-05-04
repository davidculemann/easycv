import SidebarNav from "@/components/account/sidebar-nav";
import { PersonalInfoForm } from "@/components/forms/profile/personal-info-form";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getUserProfile, updateUserProfile } from "@/lib/supabase/documents/profile";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { IconBrandGithub, IconUser } from "@tabler/icons-react";
import { Briefcase, GraduationCap, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Profile() {
	const actionData = useActionData<typeof action>();
	const [selectedTab, setSelectedTab] = useState("profile");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (actionData?.message) {
			if (actionData.success) toast.success(actionData.message);
			else toast.error(actionData.message);
		}
	}, [actionData]);

	const { profile } = useLoaderData<typeof loader>();
	const defaultValues = {
		firstName: profile?.first_name || "",
		lastName: profile?.last_name || "",
		email: profile?.email || "",
		phone: profile?.phone || "",
		address: profile?.address || "",
		linkedin: profile?.linkedin || "",
		github: profile?.github || "",
		website: profile?.website || "",
	};

	const sidebarNavItems = [
		{
			title: "Profile",
			icon: <IconUser size={18} />,
			id: "profile",
		},
		{
			title: "Education",
			icon: <GraduationCap size={18} />,
			id: "education",
		},
		{
			title: "Experience",
			icon: <Briefcase size={18} />,
			id: "experience",
		},
		{
			title: "Skills",
			icon: <Wrench size={18} />,
			id: "skills",
		},
		{
			title: "Projects",
			icon: <IconBrandGithub size={18} />,
			id: "projects",
		},
	];

	const handleSubmit = async (data: any) => {
		setIsSubmitting(true);
		try {
			const formData = new FormData();
			Object.entries(data).forEach(([key, value]) => {
				formData.append(key, value as string);
			});

			const response = await fetch(window.location.href, {
				method: "POST",
				body: formData,
			});

			const result = await response.json();
			if (result.success) {
				toast.success(result.message);
			} else {
				toast.error(result.message);
			}
		} catch (error) {
			toast.error("Failed to update profile");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div>
			<CardHeader className="p-2">
				<CardTitle className="text-3xl font-bold">Profile</CardTitle>
				<CardDescription>Complete your profile information to create a professional CV</CardDescription>
			</CardHeader>
			<Separator className="my-4 lg:my-6" />

			<div className="flex flex-1 flex-col space-y-8 md:space-y-2 md:overflow-hidden lg:flex-row lg:space-x-12 lg:space-y-0">
				<aside className="top-0 lg:sticky lg:w-1/5">
					<SidebarNav
						items={sidebarNavItems}
						selectedItem={selectedTab}
						onSelectItem={setSelectedTab}
						useNavigation={false}
					/>
				</aside>

				{selectedTab === "profile" && (
					<PersonalInfoForm
						defaultValues={defaultValues}
						onSubmit={handleSubmit}
						isSubmitting={isSubmitting}
					/>
				)}
				{/* Add other form components here as they are created */}
			</div>
		</div>
	);
}

export async function action({ request }: ActionFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const formData = await request.formData();

	// Map form data to expected field names
	const updatedProfile = {
		first_name: formData.get("firstName"),
		last_name: formData.get("lastName"),
		email: formData.get("email"),
		phone: formData.get("phone"),
		address: formData.get("address"),
		linkedin: formData.get("linkedin"),
		github: formData.get("github"),
		website: formData.get("website"),
	};

	try {
		await updateUserProfile({
			supabase,
			profile: updatedProfile as any,
		});
	} catch (error) {
		console.error(error);
		return json({ message: "Failed to update profile", success: false });
	}

	return json({ message: "Profile updated successfully", success: true });
}

export async function loader({ request }: LoaderFunctionArgs) {
	const { supabase } = getSupabaseWithHeaders({ request });
	const profile = await getUserProfile({ supabase });
	return json({ profile });
}
