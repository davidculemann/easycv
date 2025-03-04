import { useCurrentPage } from "@/hooks/use-current-page";
import type { SupabaseOutletContext } from "@/lib/supabase/supabase";
import { ThemeToggle } from "@/routes/resources.theme-toggle";
import { Link, useNavigate, useOutletContext } from "@remix-run/react";
import { ChevronLeft } from "lucide-react";
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
import { Button } from "../ui/button";
import { SheetMenu } from "./sheet-menu";
import { UserAccountNav } from "./user-account-nav";

interface NavbarProps {
	subscription?: Subscription;
}

export function Navbar({ subscription }: NavbarProps) {
	const { user } = useOutletContext<SupabaseOutletContext>();
	const userMetaData = user?.user_metadata;
	const { breadcrumbs, activePage } = useCurrentPage();
	const navigate = useNavigate();

	const hasBackButton = breadcrumbs?.length > 1;

	function handleGoBack() {
		navigate(breadcrumbs[breadcrumbs.length - 2].href);
	}

	return (
		<header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
			<div className="mx-4 sm:mx-8 flex h-14 items-center">
				<div className="flex items-center space-x-4 lg:space-x-0">
					<SheetMenu />
					{/* Mobile: Back button + current page */}
					{hasBackButton && (
						<div className="flex items-center lg:hidden">
							<Button variant="ghost" size="icon" onClick={handleGoBack}>
								<ChevronLeft className="h-4 w-4" />
								<span className="sr-only">Go back</span>
							</Button>
						</div>
					)}
					<Breadcrumb className="max-w-48 lg:max-w-none">
						<BreadcrumbList>
							<BreadcrumbItem className="lg:flex hidden">
								<BreadcrumbLink asChild>
									<Link to="/">Home</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>

							{/* Mobile: Show only current page */}
							<BreadcrumbItem className="lg:hidden">
								<BreadcrumbPage className="overflow-hidden text-ellipsis whitespace-nowrap max-w-28">
									{activePage?.label}
								</BreadcrumbPage>
							</BreadcrumbItem>

							{/* Desktop: Show full breadcrumb trail */}
							<div className="hidden lg:flex items-center gap-2">
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
							</div>
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
