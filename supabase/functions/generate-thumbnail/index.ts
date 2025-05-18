// supabase/functions/generate-thumbnail/index.ts
import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

serve(async (req) => {
	const { record } = await req.json();

	const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
	const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

	const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

	const bucket = record.bucket_id;
	const filePath = record.name;

	// Only handle PDFs
	if (!filePath.endsWith(".pdf")) {
		return new Response("Not a PDF. Skipping.", { status: 200 });
	}

	console.log("Received PDF upload:", filePath);

	// Instead of processing directly, queue it or log it
	// For now, just log to confirm it works
	// Later: insert job in 'thumbnail_jobs' table

	return new Response("Received and queued PDF", { status: 200 });
});
