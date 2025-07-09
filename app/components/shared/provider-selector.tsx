import { AI_PROVIDERS } from "@/lib/ai/config";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import SubscriptionPlanPill from "./subscription-plan-pill";

export default function ProviderSelector({
	model,
	setModel,
	isPro,
}: {
	model: string;
	setModel: (model: string) => void;
	isPro: boolean;
}) {
	const MODEL_LIST = Object.values(AI_PROVIDERS);

	return (
		<Select value={model} onValueChange={setModel}>
			<SelectTrigger>
				<SelectValue placeholder="Select a model" />
			</SelectTrigger>
			<SelectContent>
				{MODEL_LIST.map((model) => (
					<SelectItem key={model.id} value={model.id} disabled={!isPro && model.proOnly}>
						<div className="flex gap-2 items-center">
							{model.displayName}
							{model.proOnly && <SubscriptionPlanPill planId="pro" />}
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
