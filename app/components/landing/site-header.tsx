import { Link } from "react-router";
import { buttonVariants } from "@/components/ui/button";
import { marketingConfig } from "@/config/marketing";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/routes/resources.theme-toggle";
import MainNav from "./main-nav";

export default function SiteHeader() {
	return (
		<header className="px-8 z-40 bg-background sticky top-0 w-full border-b border-border/40 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
			<div className="flex h-16 items-center justify-between py-4">
				<MainNav items={marketingConfig.mainNav} />
				<span className="flex gap-4 items-center">
					<ThemeToggle />
					<nav>
						<Link
							to="/signin"
							className={cn(buttonVariants({ variant: "secondary" }), "px-4")}
							prefetch="intent"
						>
							Sign in
						</Link>
					</nav>
				</span>
			</div>
		</header>
	);
}
