export type Price = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	planId: string;
	interval: string;
	amount: number;
	currency: string;
};

export type CurrencyCode = "usd" | "eur";

/**
 * Enumerates subscription plan names.
 * These are used as unique identifiers in both the database and Stripe dashboard.
 */
export const PLANS = {
	FREE: "free",
	PRO: "pro",
} as const;

export function isProPlan(planId: string | undefined | null) {
	return planId === PLANS.PRO;
}

export type Plan = (typeof PLANS)[keyof typeof PLANS];

/**
 * Enumerates billing intervals for subscription plans.
 */
export const INTERVALS = {
	MONTH: "month",
	YEAR: "year",
} as const;

export type Interval = (typeof INTERVALS)[keyof typeof INTERVALS];

/**
 * Enumerates supported currencies for billing.
 */
export const CURRENCIES = {
	DEFAULT: "usd",
	USD: "usd",
	EUR: "eur",
} as const;

export type Currency = (typeof CURRENCIES)[keyof typeof CURRENCIES];

export const PRICING_PLANS = {
	[PLANS.FREE]: {
		id: PLANS.FREE,
		name: "Free",
		description: "Start with the basics, upgrade anytime.",
		prices: {
			[INTERVALS.MONTH]: {
				[CURRENCIES.USD]: 0,
				[CURRENCIES.EUR]: 0,
			},
			[INTERVALS.YEAR]: {
				[CURRENCIES.USD]: 0,
				[CURRENCIES.EUR]: 0,
			},
		},
	},
	[PLANS.PRO]: {
		id: PLANS.PRO,
		name: "Pro",
		description: "Access to all features and unlimited projects.",
		prices: {
			[INTERVALS.MONTH]: {
				[CURRENCIES.USD]: 1990,
				[CURRENCIES.EUR]: 1990,
			},
			[INTERVALS.YEAR]: {
				[CURRENCIES.USD]: 19990,
				[CURRENCIES.EUR]: 19990,
			},
		},
	},
} satisfies PricingPlan;

/**
 * A type helper defining prices for each billing interval and currency.
 */
type PriceInterval<I extends Interval = Interval, C extends Currency = Currency> = {
	[interval in I]: {
		[currency in C]: Price["amount"];
	};
};

/**
 * A type helper defining the structure for subscription pricing plans.
 */
type PricingPlan<T extends Plan = Plan> = {
	[key in T]: {
		id: string;
		name: string;
		description: string;
		prices: PriceInterval;
	};
};
