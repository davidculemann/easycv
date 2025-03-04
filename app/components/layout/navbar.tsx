import { useCurrentPage } from "@/hooks/use-current-page";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { ThemeToggle } from "@/routes/resources.theme-toggle";
import { Link, useOutletContext } from "@remix-run/react";
import { Fragment } from "react";
import type { Subscription } from "types/stripe";
import SubscriptionPlanPill from "../shared/subscription-plan-pill";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { SheetMenu } from "./sheet-menu";
import { UserAccountNav } from "./user-account-nav";

interface NavbarProps {
	subscription?: Subscription;
}

export function Navbar({ subscription }: NavbarProps) {
	const { user } = useOutletContext<SupabaseOutletContext>();
	const userMetaData = user?.user_metadata;
	const { breadcrumbs, activePage } = useCurrentPage();
	return (
		<header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
			<div className="mx-4 sm:mx-8 flex h-14 items-center">
				<div className="flex items-center space-x-4 lg:space-x-0">
					<SheetMenu />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/">Home</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							{breadcrumbs?.map(({ href, label }) => (
								<Fragment key={label}>
									<BreadcrumbSeparator />
									<BreadcrumbItem>
										{label !== activePage!.label ? (
											<BreadcrumbLink asChild>
												<Link to={href}>{label}</Link>
											</BreadcrumbLink>
										) : (
											<BreadcrumbPage>{label}</BreadcrumbPage>
										)}
									</BreadcrumbItem>
								</Fragment>
							))}
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<span className="gap-4 flex flex-1 items-center justify-end">
					<ThemeToggle />
					<span className="gap-2 flex items-center">
						{userMetaData && <UserAccountNav user={userMetaData} />}
						<SubscriptionPlanPill subscription={subscription} />
					</span>
				</span>
			</div>
		</header>
	);
}
