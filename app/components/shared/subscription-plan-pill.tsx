import { cn } from "@/lib/utils";
import { isProPlan } from "@/services/stripe/plans";
import type { Subscription } from "types/stripe";

export default function SubscriptionPlanPill({ subscription }: { subscription?: Subscription }) {
	const planId = subscription?.plan_id;
	const isPro = isProPlan(planId);

	return (
		<span
			className={cn(
				"flex h-5 items-center rounded-full px-2 text-xs font-medium",
				isPro
					? "bg-subscription-pro text-subscription-pro-foreground"
					: "bg-subscription-free text-subscription-free-foreground",
			)}
		>
			{planId ? planId.charAt(0).toUpperCase() + planId.slice(1) : "Free"}
		</span>
	);
}
