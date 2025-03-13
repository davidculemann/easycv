import { generateLatexTemplate } from "@/lib/documents/latex-pdf";
import type { FullCVContext } from "@/lib/documents/types";
import { getSupabaseWithHeaders } from "@/lib/supabase/supabase.server";
import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import axios from "axios";

export async function action({ request }: ActionFunctionArgs) {
	try {
		const { supabase } = getSupabaseWithHeaders({ request });

		// Verify authentication
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) {
			return json({ error: "Unauthorized" }, { status: 401 });
		}

		// Get the CV data from request
		const formData = await request.formData();
		const cvId = formData.get("cvId")?.toString();
		const cvData = formData.get("cvData")?.toString();

		if (!cvId || !cvData) {
			return json({ error: "Missing required data" }, { status: 400 });
		}

		// Parse the CV data
		const data = JSON.parse(cvData) as FullCVContext;

		// Generate LaTeX content
		const latexContent = generateLatexTemplate(data);

		console.log("Sending request to LaTeX API...");

		// FIXED: The service doesn't accept the filename parameter - removed it
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

			// Return the PDF
			return new Response(response.data, {
				status: 200,
				headers: {
					"Content-Type": "application/pdf",
					"Content-Disposition": `attachment; filename="cv-${cvId}.pdf"`,
				},
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				// Convert the buffer to readable format
				if (error.response?.data) {
					const errorData = error.response.data;
					if (Buffer.isBuffer(errorData)) {
						const errorText = errorData.toString("utf-8");
						console.error("LaTeX API error:", errorText);
						try {
							// Try to parse as JSON
							const errorJson = JSON.parse(errorText);
							return json({ error: errorJson.error || "LaTeX API error" }, { status: 500 });
						} catch {
							// If not JSON, return as is
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
