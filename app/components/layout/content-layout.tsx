import type { Subscription } from "types/stripe";
import { useStore } from "zustand";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Footer } from "./footer";
import { Navbar } from "./navbar";

interface ContentLayoutProps {
	subscription?: Subscription;
	children: React.ReactNode;
}

export function ContentLayout({ subscription, children }: ContentLayoutProps) {
	const sidebar = useStore(useSidebarToggle, (state) => state);

	if (!sidebar) return null;

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar subscription={subscription} />
			<div className="h-full w-full flex flex-1">{children}</div>
			<span className="mt-auto">
				<Footer />
			</span>
		</div>
	);
}
