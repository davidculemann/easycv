import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

//NOTE: for any further changes, we need to update the edge function in the supabase project
// supabase functions deploy generate-thumbnail --project-ref <project_id>

serve(async (req) => {
	const { record } = await req.json();
	const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

	const bucket = record.bucket_id;
	const filePath = record.name;
	if (!filePath.endsWith(".pdf")) {
		return new Response("Not a PDF. Skipping.", { status: 200 });
	}

	try {
		const { data: blob } = await supabase.storage.from(bucket).download(filePath);
		const pdfBytes = await blob.arrayBuffer();

		const renderRes = await fetch(`${Deno.env.get("FLY_URL")}/generate-thumbnail`, {
			method: "POST",
			headers: {
				"Content-Type": "application/pdf",
				"x-api-key": Deno.env.get("FLY_API_KEY")!,
			},
			body: pdfBytes,
		});
		if (!renderRes.ok) throw new Error("Render failed");
		const pngBuffer = Buffer.from(await renderRes.arrayBuffer());

		const thumbPath = filePath.replace(".pdf", "/thumbs/preview.jpg");

		const { error: upErr } = await supabase.storage.from(bucket).upload(thumbPath, thumbBuffer, { upsert: true });
		if (upErr) throw upErr;

		return new Response("Thumbnail created", { status: 200 });
	} catch (e) {
		console.error("Thumbnail failed:", e);
		return new Response("Error processing thumbnail", { status: 500 });
	}
});
