import { useDelegatedReactRouterLinks } from "@/components/docs/delegate-links";
import { docConfig } from "@/config/doc";
import { siteConfig } from "@/config/site";
import iconsHref from "@/icons.svg";
import type { Doc } from "@/lib/docs-utils/github";
import { getRepoDoc } from "@/lib/docs-utils/github";
import { CACHE_CONTROL, handleRedirects } from "@/lib/docs-utils/http.server";
import { getMeta } from "@/lib/docs-utils/meta";
import type { loader as rootLoader } from "@/root";
import { type loader as docsLayoutLoader, useGitHubRef } from "@/routes/_landing.docs.$lang.$ref";
import type { HeadersFunction, LoaderFunctionArgs, SerializeFrom } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import type { MetaFunction } from "@remix-run/react";
import { Link, isRouteErrorResponse, useLoaderData, useParams, useRouteError } from "@remix-run/react";
import * as React from "react";
import invariant from "tiny-invariant";

export async function loader({ params, request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const baseUrl = `${url.protocol}//${url.host}`;
	const siteUrl = baseUrl + url.pathname;
	const ogImageUrl = `${baseUrl}/img/og.1.jpg`;
	invariant(params.ref, "expected `ref` params");
	//Handle Images
	if (params["*"]?.endsWith(".png") || params["*"]?.endsWith(".svg")) {
		throw redirect(`/docs/${params.lang}/${params.ref}/images/${params["*"]}`);
	}
	//Continue processing docs
	try {
		const pathPrefix = docConfig.pathToDocs ? `${docConfig.pathToDocs}/` : "";
		const slug = params["*"]?.endsWith("/changelog") ? "CHANGELOG" : `${pathPrefix}${params["*"] || "index"}`;
		const doc = await getRepoDoc(useGitHubRef(params.ref), slug);
		if (!doc) throw null;
		return json({ doc, siteUrl, ogImageUrl }, { headers: { "Cache-Control": CACHE_CONTROL.DEFAULT } });
	} catch (_) {
		if (params.ref === "main" && params["*"]) {
			// Only perform redirects for 404's on `main` URLs which are likely being
			// redirected from the root `/docs/{slug}`.  If someone is direct linking
			// to a missing slug on an old version or tag, then a 404 feels appropriate.
			handleRedirects(`/docs/${params["*"]}`);
		}
		throw json(null, { status: 404 });
	}
}

export const headers: HeadersFunction = ({ loaderHeaders }) => {
	// Inherit the caching headers from the loader so we don't cache 404s
	const headers = new Headers(loaderHeaders);
	headers.set("Vary", "Cookie");
	return headers;
};

const LAYOUT_LOADER_KEY = "routes/_landing.docs.$lang.$ref";

type Loader = typeof loader;
type MatchLoaders = {
	[LAYOUT_LOADER_KEY]: typeof docsLayoutLoader;
	root: typeof rootLoader;
};

export const meta: MetaFunction<Loader, MatchLoaders> = (args) => {
	const { data } = args;

	const parentData = args.matches.find((match) => match.id === LAYOUT_LOADER_KEY)?.data;
	const rootData = args.matches.find((match) => match.id === "root")?.data;
	// console.log(args, parentData, LAYOUT_LOADER_KEY);
	// if (process.env.NODE_ENV !== "development") {
	// 	invariant(parentData && "latestVersion" in parentData, "No parent data found");
	// }
	invariant(rootData && "isProductionHost" in rootData, "No root data found");

	if (!data) {
		return [{ title: "Not Found" }];
	}

	const { doc } = data;

	const { latestVersion, releaseBranch, branches, currentRef } = parentData || {};

	const titleAppend =
		currentRef === releaseBranch || currentRef === latestVersion
			? ""
			: branches?.includes(currentRef!)
				? ` (${currentRef} branch)`
				: ` (${currentRef})`;

	const title = doc.attrs.title + titleAppend;
	const description = doc.attrs.description ?? siteConfig.description;

	// seo: only want to index the main branch
	const isMainBranch = currentRef === releaseBranch;

	const robots = rootData.isProductionHost && isMainBranch ? "index,follow" : "noindex,nofollow";

	const { siteUrl, ogImageUrl } = data;

	return getMeta({
		title: `${title} | ${siteConfig.name}`,
		description: `${description}`,
		siteUrl,
		image: ogImageUrl,
		additionalMeta: [
			{ name: "og:type", content: "article" },
			{ name: "og:site_name", content: `${siteConfig.name}` },
			{ name: "docsearch:language", content: args.params.lang || "en" },
			{ name: "docsearch:version", content: args.params.ref || "v1" },
			{ name: "robots", content: robots },
			{ name: "googlebot", content: robots },
		],
	});
};

export default function DocPage() {
	const { doc } = useLoaderData<typeof loader>();
	const ref = React.useRef<HTMLDivElement>(null);
	useDelegatedReactRouterLinks(ref);
	const showTOC = doc.attrs.toc !== false;

	return (
		<div className="xl:flex xl:w-full xl:justify-between xl:gap-8">
			{!showTOC ? null : doc.headings.length > 3 ? (
				<>
					<SmallOnThisPage doc={doc} />
					<LargeOnThisPage doc={doc} />
				</>
			) : (
				<div className="hidden xl:order-1 xl:block xl:w-56 xl:flex-shrink-0" />
			)}
			<div className="min-w-0 xl:flex-grow">
				<div ref={ref} className="markdown w-full max-w-3xl pt-8 pb-[33vh]">
					<div className="md-prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
				</div>
			</div>
		</div>
	);
}

function LargeOnThisPage({ doc }: { doc: SerializeFrom<Doc> }) {
	return (
		<div className="sticky top-36 order-1 mt-20 hidden max-h-[calc(100vh-9rem)] w-56 flex-shrink-0 self-start overflow-y-auto pb-10 xl:block">
			<nav className="mb-3 flex items-center font-semibold">On this page</nav>
			<ul className="md-toc flex flex-col flex-wrap gap-3 leading-[1.125]">
				{doc.headings.map((heading, i) => {
					return (
						<li key={i} className={heading.headingLevel === "h2" ? "ml-0" : "ml-4"}>
							<Link
								to={`#${heading.slug}`}
								dangerouslySetInnerHTML={{ __html: heading.html || "" }}
								className={
									"group relative py-1 text-sm text-gray-500 decoration-gray-200 underline-offset-4 hover:underline dark:text-gray-400 dark:decoration-gray-500"
								}
							/>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function SmallOnThisPage({ doc }: { doc: SerializeFrom<Doc> }) {
	return (
		<details className="group -mx-4 flex h-full flex-col sm:-mx-6 lg:mx-0 lg:mt-4 xl:ml-80 xl:hidden">
			<summary className="_no-triangle flex cursor-pointer select-none items-center gap-2 border-b border-gray-50 bg-white px-2 py-3 text-sm font-medium hover:bg-gray-50 active:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800 dark:active:bg-gray-700">
				<div className="flex items-center gap-2">
					<svg aria-hidden className="h-5 w-5 group-open:hidden">
						<use href={`${iconsHref}#chevron-r`} />
					</svg>
					<svg aria-hidden className="hidden h-5 w-5 group-open:block">
						<use href={`${iconsHref}#chevron-d`} />
					</svg>
				</div>
				<div className="whitespace-nowrap">On this page</div>
			</summary>
			<ul className="pl-9">
				{doc.headings.map((heading, i) => (
					<li key={i} className={heading.headingLevel === "h2" ? "ml-0" : "ml-4"}>
						<Link
							to={`#${heading.slug}`}
							dangerouslySetInnerHTML={{ __html: heading.html || "" }}
							className="block py-2 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
						/>
					</li>
				))}
			</ul>
		</details>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();
	const params = useParams();
	if (isRouteErrorResponse(error)) {
		return (
			<div className="flex h-[50vh] flex-col items-center justify-center">
				<h1 className="text-9xl font-bold">{error.status}</h1>
				<p className="text-lg">
					{[400, 404].includes(error.status) ? (
						<>
							There is no doc for <i className="text-gray-500">{params["*"]}</i>
						</>
					) : (
						error.statusText
					)}
				</p>
			</div>
		);
	}
	throw error;
}
