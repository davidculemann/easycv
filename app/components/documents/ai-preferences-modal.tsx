import { Badge } from "@/components/ui/badge";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePreferences } from "@/hooks/api-hooks/usePreferences";
import { AI_PROVIDERS, RECOMMENDED_MODEL, RECOMMENDED_TONE, TONES } from "@/lib/ai/config";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { cn } from "@/lib/utils";
import { useOutletContext } from "@remix-run/react";
import type { Database } from "db_types";
import { Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent, DrawerTrigger } from "../ui/drawer";

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
	const { supabase, user, subscription } = useOutletContext<SupabaseOutletContext>();
	const isPro = !!subscription;
	const [open, setOpen] = useState(false);
	const isMobile = useMediaQuery("(max-width: 768px)");

	const { preferences, isLoadingPreferences, updatePreferences, isUpdatingPreferences } = usePreferences({
		supabase,
		id: user?.id,
	});

	const isLoading = isLoadingPreferences || isUpdatingPreferences;

	function handleChange(field: keyof Preferences, value: string) {
		updatePreferences({ [field]: value });
	}

	if (isMobile)
		return (
			<Drawer>
				<DrawerTrigger asChild>{trigger}</DrawerTrigger>
				<DrawerContent>
					<ModalContent preferences={preferences} isPro={isPro} handleChange={handleChange} />
				</DrawerContent>
			</Drawer>
		);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			{trigger ? (
				<DialogTrigger asChild>{trigger}</DialogTrigger>
			) : (
				<DialogTrigger asChild>
					<Button variant="outline">AI Preferences</Button>
				</DialogTrigger>
			)}
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-emerald-500" />
						AI Preferences
					</DialogTitle>
					<DialogDescription>
						Control your default AI model and tone for document generation.
					</DialogDescription>
				</DialogHeader>

				<ModalContent preferences={preferences} isPro={isPro} handleChange={handleChange} />

				<DialogFooter>
					<Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
						Cancel
					</Button>
					<Button
						disabled={isLoading}
						onClick={() => setOpen(false)}
						className="bg-emerald-600 hover:bg-emerald-700 text-white"
					>
						Save Preferences
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export default AIPreferencesModal;

function ModalContent({
	preferences,
	isPro,
	handleChange,
}: {
	preferences: Database["public"]["Tables"]["preferences"]["Row"] | undefined;
	isPro: boolean;
	handleChange: (field: keyof Preferences, value: string) => void;
}) {
	const [activeTab, setActiveTab] = useState("model");

	return (
		<Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2 p-2">
			<TabsList className="grid w-full grid-cols-2">
				<TabsTrigger value="model">AI Model</TabsTrigger>
				<TabsTrigger value="tone">Writing Tone</TabsTrigger>
			</TabsList>

			<TabsContent value="model" className="space-y-4 py-4">
				<div className="space-y-2">
					<Label htmlFor="model">Select your preferred AI model</Label>
					<div className="grid grid-cols-1 gap-3">
						{Object.values(AI_PROVIDERS).map((provider) => (
							<div key={provider.id} className="space-y-2">
								<h3 className="text-sm font-medium text-gray-500">{provider.displayName}</h3>
								<div className="grid grid-cols-1 gap-2">
									{provider.modelIds.map((modelId) => {
										const isSelected = preferences?.default_model === modelId;
										const isProOnly = provider.proOnly;
										const disabled = isProOnly && !isPro;
										const modelCard = (
											<div
												key={modelId}
												className={cn(
													"flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-all",
													isSelected
														? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
														: "hover:border-gray-300 dark:hover:border-gray-600",
													disabled && "opacity-50 cursor-not-allowed",
												)}
												onClick={() => !disabled && handleChange("default_model", modelId)}
												onKeyDown={(e) => {
													if (!disabled && (e.key === "Enter" || e.key === " ")) {
														handleChange("default_model", modelId);
													}
												}}
												tabIndex={0}
												role="button"
												aria-pressed={isSelected}
												aria-disabled={disabled}
											>
												<div className="flex items-center gap-3">
													<div
														className={cn(
															"flex h-5 w-5 items-center justify-center rounded-full border",
															isSelected
																? "border-emerald-500 bg-emerald-500 text-white"
																: "border-gray-300 dark:border-gray-600",
														)}
													>
														{isSelected && <Check className="h-3 w-3" />}
													</div>
													<div>
														<p className="text-sm font-medium flex items-center gap-2">
															{modelId}
															{isProOnly && (
																<Badge variant="secondary" className="ml-2">
																	Pro
																</Badge>
															)}
														</p>
														<p className="text-xs text-gray-500">
															{modelId === RECOMMENDED_MODEL && (
																<span className="text-emerald-500">Recommended</span>
															)}
														</p>
													</div>
												</div>
												{disabled && (
													<TooltipProvider>
														<Tooltip>
															<TooltipTrigger asChild>
																<span tabIndex={-1} aria-hidden="true" />
															</TooltipTrigger>
															<TooltipContent side="top">
																Upgrade to Pro to use this model
															</TooltipContent>
														</Tooltip>
													</TooltipProvider>
												)}
											</div>
										);
										return modelCard;
									})}
								</div>
							</div>
						))}
					</div>
				</div>
			</TabsContent>

			<TabsContent value="tone" className="space-y-4 py-4">
				<div className="space-y-2">
					<Label>Select your preferred writing tone</Label>
					<RadioGroup
						value={preferences?.preferred_tone ?? RECOMMENDED_TONE}
						onValueChange={(value) => handleChange("preferred_tone", value)}
						className="grid grid-cols-1 gap-3"
					>
						{TONES.map((tone) => {
							const Icon = tone.icon;
							const isRecommended = tone.value === RECOMMENDED_TONE;
							return (
								<div key={tone.value} className="relative">
									<RadioGroupItem value={tone.value} id={tone.value} className="peer sr-only" />
									<Label
										htmlFor={tone.value}
										className={cn(
											"flex flex-col items-start justify-between rounded-lg border p-4",
											"cursor-pointer transition-all hover:border-emerald-500/50",
											"peer-data-[state=checked]:border-emerald-500 peer-data-[state=checked]:bg-emerald-50 dark:peer-data-[state=checked]:bg-emerald-950/20",
										)}
									>
										<div className="flex w-full items-start justify-between">
											<div className="flex items-center gap-3">
												<div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900">
													<Icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
												</div>
												<div>
													<p className="font-medium">{tone.label}</p>
													<p className="text-sm text-gray-500">{tone.description}</p>
												</div>
											</div>
											{isRecommended && (
												<span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400">
													Recommended
												</span>
											)}
										</div>
										{tone.example && (
											<div className="mt-3 w-full">
												<div className="rounded-md bg-gray-100 p-2 text-xs dark:bg-gray-800">
													<p className="italic">{tone.example}</p>
												</div>
											</div>
										)}
									</Label>
								</div>
							);
						})}
					</RadioGroup>
				</div>
			</TabsContent>
		</Tabs>
	);
}
