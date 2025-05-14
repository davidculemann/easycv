import type { CVProfileInput } from "@/components/forms/profile/logic/types";
import { ensureValidProfile } from "@/components/forms/profile/logic/types";
import { checkSectionCompletion } from "@/components/forms/profile/logic/utils";
import { getUserProfile, updateUserProfile } from "@/lib/supabase/documents/profile";

type HandleProfileSectionUpdateArgs = {
	supabase: any;
	headers: any;
	formData: FormData;
	sectionKey: string;
	formKey: string;
};

export async function handleProfileSectionUpdate({
	supabase,
	headers,
	formData,
	sectionKey,
	formKey,
}: HandleProfileSectionUpdateArgs) {
	let dbProfile: CVProfileInput;
	try {
		dbProfile = await getUserProfile({ supabase });
	} catch (error) {
		console.error("Failed to get profile:", error);
		return new Response(JSON.stringify({ message: "Failed to get profile", success: false }), {
			headers: { "Content-Type": "application/json" },
		});
	}

	const jsonString = formData.get(formKey) as string;
	let parsedValue = null;

	if (jsonString) {
		try {
			parsedValue = JSON.parse(jsonString);
		} catch (e) {
			console.error(`Error parsing ${sectionKey} JSON:`, e);
			return new Response(JSON.stringify({ message: `Invalid ${sectionKey} data format`, success: false }), {
				headers: { "Content-Type": "application/json" },
			});
		}
	}

	try {
		await updateUserProfile({
			supabase,
			profile: {
				...dbProfile,
				[sectionKey]: parsedValue,
			},
		});

		const updatedProfile = { ...dbProfile, [sectionKey]: parsedValue };
		const validProfile = ensureValidProfile(updatedProfile);
		const hasPersonal = checkSectionCompletion(validProfile, "personal");
		const hasEducation = checkSectionCompletion(validProfile, "education");
		const hasExperience = checkSectionCompletion(validProfile, "experience");
		const hasBeenCompleted = hasPersonal && hasEducation && hasExperience;
		if (hasBeenCompleted && !dbProfile.completed) {
			await updateUserProfile({
				supabase,
				profile: {
					...updatedProfile,
					completed: true,
				},
			});
		}
	} catch (error) {
		console.error(`Failed to update ${sectionKey}:`, error);
		return new Response(JSON.stringify({ message: `Failed to update ${sectionKey}`, success: false }), {
			headers: { "Content-Type": "application/json" },
		});
	}

	return new Response(JSON.stringify({ success: true, noNavigate: !!formData.get("saveChanges") }), {
		headers: {
			...headers,
			"Content-Type": "application/json",
		},
	});
}
