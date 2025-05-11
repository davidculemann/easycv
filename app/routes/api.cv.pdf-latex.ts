import { generateLatexTemplate } from "@/lib/documents/latex-pdf";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import axios from "axios";

export async function action({ request }: ActionFunctionArgs) {
	try {
		const { supabase } = getSupabaseWithHeaders({ request });

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return json({ error: "Unauthorized" }, { status: 401 });
		}

		const formData = await request.formData();
		const cvId = formData.get("cvId")?.toString();
		const cvData = formData.get("cvData")?.toString();

		if (!cvId || !cvData) {
			return json({ error: "Missing required data" }, { status: 400 });
		}

		const data = JSON.parse(cvData);

		const latexContent = generateLatexTemplate(data);

		try {
			const response = await axios.post(
				"https://latex.ytotech.com/builds/sync",
				{
					compiler: "pdflatex",
					resources: [
						{
							main: true,
							content: latexContent,
						},
					],
				},
				{
					responseType: "arraybuffer",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/pdf",
					},
				},
			);

			console.log("LaTeX API response status:", response.status);

			return new Response(response.data, {
				status: 200,
				headers: {
					"Content-Type": "application/pdf",
					"Content-Disposition": `attachment; filename="cv-${cvId}.pdf"`,
				},
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (error.response?.data) {
					const errorData = error.response.data;
					if (Buffer.isBuffer(errorData)) {
						const errorText = errorData.toString("utf-8");
						console.error("LaTeX API error:", errorText);
						try {
							const errorJson = JSON.parse(errorText);
							return json({ error: errorJson.error || "LaTeX API error" }, { status: 500 });
						} catch {
							return json({ error: errorText }, { status: 500 });
						}
					}
				}
				return json({ error: error.message }, { status: 500 });
			}
			throw error;
		}
	} catch (error) {
		console.error("PDF generation error:", error);
		return json(
			{
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
