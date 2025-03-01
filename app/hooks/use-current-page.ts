import { useLocation } from "@remix-run/react";
import { FileBadge2, LayoutGrid, LetterText, type LucideIcon, Settings } from "lucide-react";
import { useMemo } from "react";

type Submenu = {
	href: string;
	label: string;
	active: boolean;
};

type Menu = {
	href: string;
	label: string;
	active: boolean;
	icon: LucideIcon;
	submenus?: Submenu[];
};

type Group = {
	groupLabel: string;
	menus: Menu[];
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
			groupLabel: "Documents",
			menus: [
				{
					href: "/cv",
					label: "CVs",
					active: pathname.includes("/cv"),
					icon: FileBadge2,
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

export function useCurrentPage() {
	const pathname = useLocation().pathname;
	const menuList = useMemo(() => getMenuList(pathname), [pathname]);

	const { activePage, breadcrumbs } = useMemo(() => {
		let activePage = null;
		const breadcrumbs = [];

		for (const group of menuList) {
			for (const menu of group.menus) {
				if (menu.active && menu.href) {
					activePage = menu;
					breadcrumbs.push(menu);
				}
				if (menu.submenus) {
					for (const submenu of menu.submenus) {
						if (pathname === submenu.href) {
							activePage = submenu;
							breadcrumbs.push(submenu);
						}
					}
				}
			}
		}

		return { activePage, breadcrumbs };
	}, [menuList, pathname]);

	return { activePage, menuList, breadcrumbs };
}
