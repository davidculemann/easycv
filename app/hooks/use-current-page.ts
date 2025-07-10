import { useLocation, useParams } from "react-router";
import { FileBadge2, LayoutGrid, LetterText, type LucideIcon, Settings, UserPen } from "lucide-react";

type Submenu = {
	href: string;
	label: string;
	active?: boolean;
	hidden?: boolean;
	matches?: (path: string) => boolean;
	resolveLabel?: (params: Record<string, string>) => string;
};

type Page = {
	href: string;
	label: string;
	active: boolean;
	icon: LucideIcon;
	submenus?: Submenu[];
	hidden?: boolean;
};

type Group = {
	groupLabel: string;
	menus: Page[];
};

export function getMenuList(pathname: string): Group[] {
	return [
		{
			groupLabel: "",
			menus: [
				{
					href: "/dashboard",
					label: "Dashboard",
					active: pathname.includes("/dashboard"),
					icon: LayoutGrid,
					submenus: [],
				},
			],
		},
		{
			groupLabel: "Document Generation",
			menus: [
				{
					href: "profile",
					label: "Profile",
					active: pathname.startsWith("/profile"),
					icon: UserPen,
				},
				{
					href: "cvs",
					label: "CVs",
					active: pathname.includes("/cvs"),
					icon: FileBadge2,
					submenus: [
						{
							href: "/cvs/:id",
							label: "CV",
							matches: (path: string) => {
								return path.startsWith("/cvs/") && path !== "/cvs";
							},
							resolveLabel: (params) => {
								return `CV ${params.id}`;
							},
						},
					],
				},
				{
					href: "/cover-letters",
					label: "Cover Letters",
					active: pathname.includes("/cover-letters"),
					icon: LetterText,
				},
			],
		},
		{
			groupLabel: "Settings",
			menus: [
				{
					href: "/account",
					label: "Account",
					active: pathname.includes("/account"),
					icon: Settings,
					submenus: [
						{
							href: "/account/settings",
							label: "Settings",
							active: pathname === "/account/settings",
						},
						{
							href: "/account/billing",
							label: "Billing",
							active: pathname.includes("/account/billing"),
						},
					],
				},
			],
		},
	];
}

export const useCurrentPage = () => {
	const location = useLocation();
	const params = useParams();
	const currentPath = location.pathname;

	const pages = [
		{
			href: "/dashboard",
			label: "Dashboard",
		},
		{
			href: "/profile",
			label: "Profile",
		},
		{
			href: "/cvs",
			label: "CVs",
			submenus: [
				{
					href: "/cvs/:id",
					label: "CV",
					matches: (path: string) => {
						return path.startsWith("/cvs/") && path !== "/cvs";
					},
					resolveLabel: (params: Record<string, string>) => {
						return `CV ${params.id}`;
					},
				},
			],
		},
		{
			href: "/cover-letters",
			label: "Cover Letters",
			active: currentPath.includes("/cover-letters"),
			icon: LetterText,
		},
		{
			href: "/account",
			label: "Account",
			active: currentPath.includes("/account"),
			icon: Settings,
			submenus: [
				{
					href: "/account/settings",
					label: "Settings",
					active: currentPath === "/account/settings",
				},
				{
					href: "/account/billing",
					label: "Billing",
					active: currentPath.includes("/account/billing"),
				},
			],
		},
	];

	const findActivePage = (path: string) => {
		const page = pages.find((p) => p.href === path) as Page;

		if (!page) {
			for (const mainPage of pages) {
				if (mainPage.submenus) {
					const submenu = mainPage.submenus.find((sub: Submenu) =>
						sub.matches ? sub.matches(path) : sub.href === path,
					) as Submenu;
					if (submenu) {
						return {
							...submenu,
							label: submenu.resolveLabel
								? submenu.resolveLabel(params as Record<string, string>)
								: submenu.label,
						};
					}
				}
			}
		}

		return page;
	};

	const activePage = findActivePage(currentPath);

	const breadcrumbs = currentPath
		.split("/")
		.filter(Boolean)
		.reduce<Array<{ href: string; label: string }>>((acc, _segment, index, arr) => {
			const path = `/${arr.slice(0, index + 1).join("/")}`;
			const page = findActivePage(path);
			if (page && !page.hidden) {
				acc.push({ href: path, label: page.label });
			}
			return acc;
		}, []);

	return { breadcrumbs, activePage, menuList: getMenuList(currentPath) };
};
