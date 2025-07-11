declare module "react-router" {
	// Your AppLoadContext used in v2
	interface AppLoadContext {
		// Environment variables
		env: {
			SUPABASE_URL: string;
			SUPABASE_ANON_KEY: string;
			NODE_ENV: string;
			PORT?: string;
		};
		// You can add more context properties as needed
		// For example:
		// session: any;
		// user: any;
		// etc.
	}

	// TODO: remove this once we've migrated to `Route.LoaderArgs` instead for our loaders
	interface LoaderFunctionArgs {
		context: AppLoadContext;
	}

	// TODO: remove this once we've migrated to `Route.ActionArgs` instead for our actions
	interface ActionFunctionArgs {
		context: AppLoadContext;
	}
}

export {}; // necessary for TS to treat this as a module
