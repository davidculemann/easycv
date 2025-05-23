export const APP_NAME = "easycv";

export function title(pageTitle?: string) {
	if (!pageTitle) return APP_NAME;

	return `${pageTitle} | ${APP_NAME}`;
}

export const PROTECTED_ROUTES = ["/dashboard", "/account/billing", "/account/settings", "/update-password"];
export const NO_AUTH_ROUTES = ["/signin", "/signup"];
