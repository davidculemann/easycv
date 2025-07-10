import { PassThrough } from "node:stream";
import type { AppLoadContext, EntryContext } from "react-router";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";

export const streamTimeout = 5000;

export default function handleRequest(
	request: Request,
	responseStatusCode: number,
	responseHeaders: Headers,
	reactRouterContext: EntryContext,
	_loadContext: AppLoadContext,
) {
	const isBot = isbot(request.headers.get("user-agent"));

	let status = responseStatusCode;
	const headers = new Headers(responseHeaders);
	headers.set("Content-Type", "text/html; charset=utf-8");

	return new Promise((resolve, reject) => {
		let shellRendered = false;
		const { pipe, abort } = renderToPipeableStream(
			<ServerRouter context={reactRouterContext} url={request.url} />,
			{
				onAllReady() {
					if (!isBot) return;

					resolve(
						new Response(createReadableStreamFromReadable(pipe(new PassThrough())), {
							headers,
							status,
						}),
					);
				},
				onShellReady() {
					shellRendered = true;

					if (isBot) return;

					resolve(
						new Response(createReadableStreamFromReadable(pipe(new PassThrough())), {
							headers,
							status,
						}),
					);
				},
				onShellError(error: unknown) {
					reject(error);
				},
				onError(error: unknown) {
					status = 500;
					// Log streaming rendering errors from inside the shell.  Don't log
					// errors encountered during initial shell rendering since they'll
					// reject and get logged in handleDocumentRequest.
					if (shellRendered) {
						console.error(error);
					}
				},
			},
		);

		setTimeout(abort, streamTimeout + 1000);
	});
}
