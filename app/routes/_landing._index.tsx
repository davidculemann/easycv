import type { MetaFunction } from "react-router";
import { Form, Link } from "react-router";
import axios from "axios";
import { motion, useInView } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { title } from "@/config.shared";
import { containerVariants, enterAnimation, itemVariants } from "@/lib/framer/animations";
import { validateEmail } from "@/lib/utils";

export const meta: MetaFunction = () => {
	return [
		{
			title: title(),
		},
		{
			name: "description",
			content: "Innovate, Disrupt, and Scale with Our All-In-One Solution.",
		},
	];
};

const STEPS = [
	{
		number: 1,
		title: "Input Your Details",
		description: "Enter your work history, education, and skills. Upload an existing CV to speed up the process.",
	},
	{
		number: 2,
		title: "AI Enhancement",
		description: "Our AI analyzes your information and suggests improvements to make your CV stand out.",
	},
	{
		number: 3,
		title: "Download & Apply",
		description: "Export your polished CV in multiple formats, ready to help you land your dream job.",
	},
];

const TESTIMONIALS = [
	{
		name: "Sarah Johnson",
		role: "Marketing Manager",
		content:
			"The AI suggestions helped me highlight achievements I would have missed. Landed my dream job within weeks!",
		avatar: "https://avatar.iran.liara.run/public/28",
		initials: "SJ",
	},
	{
		name: "Michael Chen",
		role: "Software Engineer",
		content:
			"The ATS-friendly templates and AI enhancement features gave me confidence in my applications. Highly recommended!",
		avatar: "https://avatar.iran.liara.run/public/44",
		initials: "MC",
	},
	{
		name: "Emily Rodriguez",
		role: "UX Designer",
		content:
			"Created both my CV and cover letter in under an hour. The AI understood exactly how to present my experience.",
		avatar: "https://avatar.iran.liara.run/public/10",
		initials: "ER",
	},
	{
		name: "James Wilson",
		role: "Sales Director",
		content:
			"The interview prep feature is a game-changer. Helped me ace my last interview and secure a 30% pay raise.",
		avatar: "https://avatar.iran.liara.run/public/24",
		initials: "JW",
	},
	{
		name: "Lisa Thompson",
		role: "Project Manager",
		content: "Clean, professional templates and intuitive AI guidance. Made updating my CV actually enjoyable!",
		avatar: "https://avatar.iran.liara.run/public/12",
		initials: "LT",
	},
	{
		name: "David Park",
		role: "Data Scientist",
		content:
			"The AI suggestions for technical skills presentation were spot-on. Perfect for modern tech job applications.",
		avatar: "https://avatar.iran.liara.run/public/20",
		initials: "DP",
	},
];

export default function Index() {
	const howItWorksRef = useRef(null);
	const isInView = useInView(howItWorksRef, { amount: 0.6, once: true });

	// Add state for email input
	const [email, setEmail] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	async function handleSubmitEmail(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setIsSubmitting(true);
		const form = event.currentTarget;
		const formData = new FormData(form);
		try {
			await axios.post("api/mailing-list", formData);
			toast.success("You've joined our mailing list!");
			setIsSuccess(true);
		} catch (error) {
			if (axios.isAxiosError(error) && error.response) {
				const { error: errorMessage = "Something went wrong, please try again." } = error.response.data;
				toast.error(errorMessage);
			} else {
				toast.error("An unexpected error occurred. Try again later.");
			}
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="flex flex-col bg-gradient-to-br from-orange-50/70 via-background to-blue-50/50 dark:from-orange-950/15 dark:via-background dark:to-blue-950/15">
			<main className="flex-1">
				<motion.section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-24" {...enterAnimation}>
					<div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
						<h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
							The Ultimate AI-Powered CV Builder
						</h1>
						<p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
							Create professional, ATS-friendly CVs in minutes. Our AI-powered platform helps you craft
							the perfect CV, tailored to your experience and industry.
						</p>
						<div className="space-x-4 flex">
							<Link to="/signin" prefetch="intent">
								<Button size="lg">Create Your CV</Button>
							</Link>
						</div>
					</div>
				</motion.section>

				<motion.section
					{...enterAnimation}
					id="features"
					className="container space-y-6 bg-slate-50 dark:bg-transparent py-6 md:py-12 lg:py-24"
				>
					<div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
						<h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
							Complete Career Support Suite
						</h2>
						<p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
							Everything you need to land your dream job, powered by advanced AI technology.
						</p>
					</div>
					<div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
						<Card>
							<CardHeader>
								<CardTitle>AI CV Builder</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Create professional CVs tailored to your industry. Our AI analyzes your experience
									and suggests the best way to present your skills.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Cover Letter Generator</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Generate compelling cover letters customized for each job application. Just input
									the company and role details.
								</p>
							</CardContent>
						</Card>
						<Card>
							<CardHeader>
								<CardTitle>Interview Prep (Coming Soon)</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-muted-foreground">
									Practice with our AI interviewer. Get personalized feedback and improve your
									interview skills.
								</p>
							</CardContent>
						</Card>
					</div>
				</motion.section>

				<motion.section
					ref={howItWorksRef}
					initial="hidden"
					animate={isInView ? "show" : "hidden"}
					variants={containerVariants}
					id="how-it-works"
					className="container py-8 md:py-12 lg:py-24"
				>
					<motion.div
						{...enterAnimation}
						className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"
					>
						<h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">How It Works</h2>
						<p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
							Create your professional CV in three simple steps
						</p>
					</motion.div>
					<motion.div
						initial="hidden"
						animate={isInView ? "show" : "hidden"}
						variants={containerVariants}
						className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3 mt-8"
					>
						{STEPS.map(({ number, description, title }) => (
							<Step key={number} {...{ number, description, title }} />
						))}
					</motion.div>
				</motion.section>

				<motion.section
					className="container py-8 md:py-12 lg:py-24 px-16 bg-slate-50 dark:bg-transparent"
					{...enterAnimation}
				>
					<div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-8">
						<h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl text-center">
							What Our Users Say
						</h2>
						<Carousel className="w-full max-w-4xl" opts={{ align: "start", loop: true }}>
							<CarouselContent>
								{TESTIMONIALS.map((testimonial, index) => (
									<CarouselItem key={index} className="md:basis-1/2">
										<Card>
											<CardHeader>
												<div className="flex items-center gap-2">
													<Avatar>
														<AvatarImage src={testimonial.avatar} />
														<AvatarFallback>{testimonial.initials}</AvatarFallback>
													</Avatar>
													<div>
														<CardTitle>{testimonial.name}</CardTitle>
														<p className="text-sm text-muted-foreground">
															{testimonial.role}
														</p>
													</div>
												</div>
											</CardHeader>
											<CardContent>"{testimonial.content}"</CardContent>
										</Card>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					</div>
				</motion.section>

				<motion.section {...enterAnimation} className="container py-8 md:py-12 lg:py-24">
					<div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
						<h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">Stay Updated</h2>
						<p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
							Enter your email below to stay updated. Or don't. It's totally up to you.
						</p>
						<div className="w-full max-w-sm space-y-2">
							<Form onSubmit={handleSubmitEmail} className="flex space-x-2">
								<Input
									className="flex-1"
									placeholder="Enter your email"
									id="email"
									name="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<Button type="submit" disabled={!validateEmail(email) || isSuccess || isSubmitting}>
									Submit
								</Button>
							</Form>
							<p className="text-xs text-muted-foreground">We will probably email you with updates.</p>
						</div>
					</div>
				</motion.section>
			</main>
		</div>
	);
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
	return (
		<motion.div variants={itemVariants} className="relative overflow-hidden rounded-lg border bg-background p-2">
			<div className="flex h-[180px] flex-col justify-between rounded-md p-6">
				<div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
					<span className="text-2xl font-bold text-blue-600">{number}</span>
				</div>
				<div className="space-y-2">
					<h3 className="font-bold">{title}</h3>
					<p className="text-sm text-muted-foreground">{description}</p>
				</div>
			</div>
		</motion.div>
	);
}
