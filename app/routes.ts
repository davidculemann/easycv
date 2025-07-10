import type { RouteConfig } from "@react-router/dev/routes";

export default [
	{
		id: "landing",
		path: "",
		file: "routes/_landing.tsx",
		children: [
			{
				id: "landing-index",
				index: true,
				file: "routes/_landing._index.tsx",
			},
			{
				id: "landing-pricing",
				path: "pricing",
				file: "routes/_landing.pricing.tsx",
			},
			{
				id: "landing-updates",
				path: "updates",
				file: "routes/_landing.updates.tsx",
			},
			{
				id: "landing-terms",
				path: "terms-of-service",
				file: "routes/_landing.terms-of-service.tsx",
			},
			{
				id: "landing-privacy",
				path: "privacy-policy",
				file: "routes/_landing.privacy-policy.tsx",
			},
		],
	},
	{
		id: "auth",
		path: "",
		file: "routes/_auth.tsx",
		children: [
			{
				id: "auth-signin",
				path: "signin",
				file: "routes/_auth.signin.tsx",
			},
			{
				id: "auth-signup",
				path: "signup",
				file: "routes/_auth.signup.tsx",
			},
			{
				id: "auth-forgot-password",
				path: "forgot-password",
				file: "routes/_auth.forgot-password.tsx",
			},
			{
				id: "auth-update-password",
				path: "update-password",
				file: "routes/_auth.update-password.tsx",
			},
			{
				id: "auth-signout",
				path: "signout",
				file: "routes/_auth.signout.tsx",
			},
		],
	},
	{
		id: "app",
		path: "",
		file: "routes/_app.tsx",
		children: [
			{
				id: "app-dashboard",
				path: "dashboard",
				file: "routes/_app.dashboard.tsx",
			},
			{
				id: "app-documents",
				path: "documents",
				file: "routes/_app._documents.tsx",
				children: [
					{
						id: "app-documents-cvs",
						path: "cvs",
						file: "components/layout/pathless-layout.tsx",
						children: [
							{
								id: "app-documents-cvs-index",
								index: true,
								file: "routes/_app._documents.cvs._index.tsx",
							},
							{
								id: "app-documents-cvs-id",
								path: ":id",
								file: "routes/_app._documents.cvs.$id.tsx",
							},
						],
					},
					{
						id: "app-documents-cover-letters",
						path: "cover-letters",
						file: "routes/_app._documents.cover-letters.tsx",
					},
					{
						id: "app-documents-profile",
						path: "profile",
						file: "routes/_app._documents.profile.tsx",
					},
				],
			},
			{
				id: "app-account",
				path: "account",
				file: "routes/_app.account.tsx",
				children: [
					{
						id: "app-account-index",
						index: true,
						file: "routes/_app.account._index.tsx",
					},
					{
						id: "app-account-billing",
						path: "billing",
						file: "routes/_app.account.billing.tsx",
					},
					{
						id: "app-account-settings",
						path: "settings",
						file: "routes/_app.account.settings.tsx",
					},
				],
			},
		],
	},
	{
		id: "api-auth-confirm",
		path: "api/auth/confirm",
		file: "routes/api.auth.confirm.ts",
	},
	{
		id: "api-confirm-signup-otp",
		path: "api/confirm-signup-otp",
		file: "routes/api.confirm-signup-otp.ts",
	},
	{
		id: "api-cv-generate",
		path: "api/cv/generate",
		file: "routes/api.cv.generate.ts",
	},
	{
		id: "api-cv-pdf-latex",
		path: "api/cv/pdf-latex",
		file: "routes/api.cv.pdf-latex.ts",
	},
	{
		id: "api-keep-alive",
		path: "api/keep-alive",
		file: "routes/api.keep-alive.ts",
	},
	{
		id: "api-mailing-list",
		path: "api/mailing-list",
		file: "routes/api.mailing-list.ts",
	},
	{
		id: "api-webhook",
		path: "api/webhook",
		file: "routes/api.webhook.ts",
	},
	{
		id: "healthcheck",
		path: "healthcheck",
		file: "routes/healthcheck.ts",
	},
	{
		id: "resources-theme-toggle",
		path: "resources/theme-toggle",
		file: "routes/resources.theme-toggle.tsx",
	},
] satisfies RouteConfig;
