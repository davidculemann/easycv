import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { cn } from "@/lib/utils";
import { useStore } from "zustand";
import { Sidebar } from "./sidebar";

export default function AdminPanelLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const sidebar = useStore(useSidebarToggle, (state) => state);

	if (!sidebar) return null;

	return (
		<>
			<Sidebar />
			<main
				className={cn(
					"h-full bg-zinc-50 dark:bg-zinc-900 transition-[margin-left] ease-in-out duration-300 overflow-y-auto",
					sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-72",
				)}
			>
				{children}
			</main>
		</>
	);
}
