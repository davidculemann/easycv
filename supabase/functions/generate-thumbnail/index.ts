import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { PDFDocument } from "https://esm.sh/pdf-lib";
import sharp from "https://esm.sh/sharp";

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
		// 1. Download PDF
		const { data: blob, error: dlErr } = await supabase.storage.from(bucket).download(filePath);
		if (dlErr || !blob) throw dlErr || new Error("No data");

		// 2. Extract first page to PNG (pseudo‑code; swap in your renderer)
		const pdfBytes = await blob.arrayBuffer();
		const pdfDoc = await PDFDocument.load(pdfBytes);
		const [page] = await pdfDoc.getPages();
		const pngBuffer = await renderPageToPNG(page); // your PDF→PNG logic

		// 3. Resize to thumbnail
		const thumbBuffer = await sharp(pngBuffer).resize({ width: 200 }).jpeg().toBuffer();

		// 4. Upload thumbnail
		const thumbPath = filePath.replace(".pdf", "/thumbs/preview.jpg");
		const { error: upErr } = await supabase.storage.from(bucket).upload(thumbPath, thumbBuffer, { upsert: true });
		if (upErr) throw upErr;

		return new Response("Thumbnail created", { status: 200 });
	} catch (e) {
		console.error("Thumbnail failed:", e);
		return new Response("Error processing thumbnail", { status: 500 });
	}
});
