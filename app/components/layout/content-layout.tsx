import type { Subscription } from "types/stripe";
import { Navbar } from "./navbar";

interface ContentLayoutProps {
	subscription?: Subscription;
	children: React.ReactNode;
}

export function ContentLayout({ subscription, children }: ContentLayoutProps) {
	return (
		<div className="h-[calc(100%-3.5rem)]">
			<Navbar subscription={subscription} />
			<div className="h-full w-full">{children}</div>
		</div>
	);
}
