export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			cover_letters: {
				Row: {
					company: string | null;
					content: string;
					created_at: string;
					id: string;
					position: string | null;
					status: string | null;
					template_id: string | null;
					title: string;
					updated_at: string;
					user_id: string | null;
					version: number | null;
				};
				Insert: {
					company?: string | null;
					content: string;
					created_at?: string;
					id?: string;
					position?: string | null;
					status?: string | null;
					template_id?: string | null;
					title: string;
					updated_at?: string;
					user_id?: string | null;
					version?: number | null;
				};
				Update: {
					company?: string | null;
					content?: string;
					created_at?: string;
					id?: string;
					position?: string | null;
					status?: string | null;
					template_id?: string | null;
					title?: string;
					updated_at?: string;
					user_id?: string | null;
					version?: number | null;
				};
				Relationships: [];
			};
			cv_profiles: {
				Row: {
					address: string | null;
					completed: boolean | null;
					created_at: string;
					education: Json | null;
					email: string | null;
					experience: Json | null;
					first_name: string | null;
					github: string | null;
					id: number;
					last_name: string | null;
					linkedin: string | null;
					phone: string | null;
					projects: Json | null;
					skills: string[] | null;
					updated_at: string;
					user_id: string | null;
					website: string | null;
				};
				Insert: {
					address?: string | null;
					completed?: boolean | null;
					created_at?: string;
					education?: Json | null;
					email?: string | null;
					experience?: Json | null;
					first_name?: string | null;
					github?: string | null;
					id?: never;
					last_name?: string | null;
					linkedin?: string | null;
					phone?: string | null;
					projects?: Json | null;
					skills?: string[] | null;
					updated_at?: string;
					user_id?: string | null;
					website?: string | null;
				};
				Update: {
					address?: string | null;
					completed?: boolean | null;
					created_at?: string;
					education?: Json | null;
					email?: string | null;
					experience?: Json | null;
					first_name?: string | null;
					github?: string | null;
					id?: never;
					last_name?: string | null;
					linkedin?: string | null;
					phone?: string | null;
					projects?: Json | null;
					skills?: string[] | null;
					updated_at?: string;
					user_id?: string | null;
					website?: string | null;
				};
				Relationships: [];
			};
			cvs: {
				Row: {
					address: string | null;
					certifications: string[] | null;
					created_at: string;
					education: Json[] | null;
					email: string | null;
					experience: Json[] | null;
					first_name: string | null;
					github: string | null;
					id: string;
					interests: string[] | null;
					languages: string[] | null;
					last_name: string | null;
					linkedin: string | null;
					phone: string | null;
					projects: Json[] | null;
					skills: string[] | null;
					status: string | null;
					summary: string | null;
					template_id: string | null;
					title: string;
					updated_at: string;
					user_id: string | null;
					version: number | null;
					website: string | null;
				};
				Insert: {
					address?: string | null;
					certifications?: string[] | null;
					created_at?: string;
					education?: Json[] | null;
					email?: string | null;
					experience?: Json[] | null;
					first_name?: string | null;
					github?: string | null;
					id?: string;
					interests?: string[] | null;
					languages?: string[] | null;
					last_name?: string | null;
					linkedin?: string | null;
					phone?: string | null;
					projects?: Json[] | null;
					skills?: string[] | null;
					status?: string | null;
					summary?: string | null;
					template_id?: string | null;
					title: string;
					updated_at?: string;
					user_id?: string | null;
					version?: number | null;
					website?: string | null;
				};
				Update: {
					address?: string | null;
					certifications?: string[] | null;
					created_at?: string;
					education?: Json[] | null;
					email?: string | null;
					experience?: Json[] | null;
					first_name?: string | null;
					github?: string | null;
					id?: string;
					interests?: string[] | null;
					languages?: string[] | null;
					last_name?: string | null;
					linkedin?: string | null;
					phone?: string | null;
					projects?: Json[] | null;
					skills?: string[] | null;
					status?: string | null;
					summary?: string | null;
					template_id?: string | null;
					title?: string;
					updated_at?: string;
					user_id?: string | null;
					version?: number | null;
					website?: string | null;
				};
				Relationships: [];
			};
			emails: {
				Row: {
					created_at: string;
					email: string | null;
					id: number;
				};
				Insert: {
					created_at?: string;
					email?: string | null;
					id?: number;
				};
				Update: {
					created_at?: string;
					email?: string | null;
					id?: number;
				};
				Relationships: [];
			};
			keep_alive: {
				Row: {
					id: number;
					name: string | null;
					random: string | null;
				};
				Insert: {
					id?: number;
					name?: string | null;
					random?: string | null;
				};
				Update: {
					id?: number;
					name?: string | null;
					random?: string | null;
				};
				Relationships: [];
			};
			plans: {
				Row: {
					created_at: string | null;
					description: string | null;
					id: string;
					name: string;
					updated_at: string | null;
				};
				Insert: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					name: string;
					updated_at?: string | null;
				};
				Update: {
					created_at?: string | null;
					description?: string | null;
					id?: string;
					name?: string;
					updated_at?: string | null;
				};
				Relationships: [];
			};
			prices: {
				Row: {
					amount: number;
					created_at: string | null;
					currency: string;
					id: string;
					interval: string;
					plan_id: string | null;
					updated_at: string | null;
				};
				Insert: {
					amount: number;
					created_at?: string | null;
					currency: string;
					id?: string;
					interval: string;
					plan_id?: string | null;
					updated_at?: string | null;
				};
				Update: {
					amount?: number;
					created_at?: string | null;
					currency?: string;
					id?: string;
					interval?: string;
					plan_id?: string | null;
					updated_at?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "prices_plan_id_fkey";
						columns: ["plan_id"];
						isOneToOne: false;
						referencedRelation: "plans";
						referencedColumns: ["id"];
					},
				];
			};
			profiles: {
				Row: {
					avatar_url: string | null;
					created_at: string | null;
					customer_id: string | null;
					email: string | null;
					first_name: string | null;
					id: string;
					last_name: string | null;
					username: string | null;
				};
				Insert: {
					avatar_url?: string | null;
					created_at?: string | null;
					customer_id?: string | null;
					email?: string | null;
					first_name?: string | null;
					id: string;
					last_name?: string | null;
					username?: string | null;
				};
				Update: {
					avatar_url?: string | null;
					created_at?: string | null;
					customer_id?: string | null;
					email?: string | null;
					first_name?: string | null;
					id?: string;
					last_name?: string | null;
					username?: string | null;
				};
				Relationships: [];
			};
			subscriptions: {
				Row: {
					cancel_at_period_end: boolean | null;
					created_at: string | null;
					current_period_end: string | null;
					current_period_start: string | null;
					id: string;
					interval: string;
					plan_id: string | null;
					price_id: string | null;
					status: string;
					updated_at: string | null;
					user_id: string | null;
				};
				Insert: {
					cancel_at_period_end?: boolean | null;
					created_at?: string | null;
					current_period_end?: string | null;
					current_period_start?: string | null;
					id?: string;
					interval: string;
					plan_id?: string | null;
					price_id?: string | null;
					status: string;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Update: {
					cancel_at_period_end?: boolean | null;
					created_at?: string | null;
					current_period_end?: string | null;
					current_period_start?: string | null;
					id?: string;
					interval?: string;
					plan_id?: string | null;
					price_id?: string | null;
					status?: string;
					updated_at?: string | null;
					user_id?: string | null;
				};
				Relationships: [
					{
						foreignKeyName: "subscriptions_plan_id_fkey";
						columns: ["plan_id"];
						isOneToOne: false;
						referencedRelation: "plans";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "subscriptions_price_id_fkey";
						columns: ["price_id"];
						isOneToOne: false;
						referencedRelation: "prices";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			[_ in never]: never;
		};
		Enums: {
			[_ in never]: never;
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database;
	}
		? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
		: never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
		? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
		: never;

export const Constants = {
	public: {
		Enums: {},
	},
} as const;
