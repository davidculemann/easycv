import { cn } from "@/lib/utils";
import { isProPlan } from "@/services/stripe/plans";
import type { Subscription } from "types/stripe";

export default function SubscriptionPlanPill({
	subscription,
	planId,
}: {
	subscription?: Subscription;
	planId?: string;
}) {
	const resolvedPlanId = planId ?? subscription?.plan_id;
	const isPro = isProPlan(resolvedPlanId);

	return (
		<span
			className={cn(
				"flex h-5 items-center rounded-full px-2 text-xs font-medium",
				isPro
					? "bg-subscription-pro text-subscription-pro-foreground"
					: "bg-subscription-free text-subscription-free-foreground",
			)}
		>
			{resolvedPlanId ? resolvedPlanId.charAt(0).toUpperCase() + resolvedPlanId.slice(1) : "Free"}
		</span>
	);
}
