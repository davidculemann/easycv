import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePreferences } from "@/hooks/api-hooks/usePreferences";
import { AI_PROVIDERS, RECOMMENDED_MODEL, RECOMMENDED_TONE, TONES } from "@/lib/ai/config";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { useOutletContext } from "@remix-run/react";

import { useState } from "react";

const MODELS = Object.values(AI_PROVIDERS).flatMap((provider) =>
	provider.modelIds.map((id) => ({
		value: id,
		label: `${provider.displayName} (${id})`,
		provider: provider.id,
	})),
);

type Preferences = {
	default_model: string;
	preferred_tone: string;
};

export function AIPreferencesModal({ trigger }: { trigger?: React.ReactNode }) {
	const { supabase, user } = useOutletContext<SupabaseOutletContext>();
	const [open, setOpen] = useState(false);

	const { preferences, isLoadingPreferences, updatePreferences, isUpdatingPreferences } = usePreferences({
		supabase,
		id: user?.id,
	});

	const isLoading = isLoadingPreferences || isUpdatingPreferences;

	function handleChange(field: keyof Preferences, value: string) {
		updatePreferences({ [field]: value });
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger ? (
				<DialogTrigger asChild>{trigger}</DialogTrigger>
			) : (
				<DialogTrigger asChild>
					<Button variant="outline">AI Preferences</Button>
				</DialogTrigger>
			)}
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>AI Preferences</DialogTitle>
					<DialogDescription>
						Control your default AI model and tone for document generation.
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-2">
					<Label htmlFor="model">Default Model</Label>
					<Select
						value={preferences?.default_model ?? RECOMMENDED_MODEL}
						onValueChange={(v) => handleChange("default_model", v)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{MODELS.map((model) => (
								<SelectItem
									key={model.value}
									value={model.value}
									className={model.value === RECOMMENDED_MODEL ? "font-bold text-primary" : ""}
								>
									{model.label}
									{model.value === RECOMMENDED_MODEL && (
										<span className="ml-2 text-xs text-primary">(Recommended)</span>
									)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="tone">Tone</Label>
					<Select
						value={preferences?.preferred_tone ?? RECOMMENDED_TONE}
						onValueChange={(v) => handleChange("preferred_tone", v)}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{TONES.map((tone) => (
								<SelectItem
									key={tone.value}
									value={tone.value}
									className={tone.value === RECOMMENDED_TONE ? "font-bold text-primary" : ""}
								>
									{tone.label}
									{tone.value === RECOMMENDED_TONE && (
										<span className="ml-2 text-xs text-primary">(Recommended)</span>
									)}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button disabled={isLoading} onClick={() => setOpen(false)}>
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default AIPreferencesModal;
