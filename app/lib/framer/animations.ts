export const enterAnimation = {
	initial: { opacity: 0, y: -30, scale: 0.8 },
	whileInView: { opacity: 1, y: 0, scale: 1 },
	transition: { duration: 0.6 },
	viewport: { once: true },
};

export const enterLeftAnimation = {
	initial: { opacity: 0, x: -40 },
	animate: { opacity: 1, x: 0 },
	transition: { duration: 0.2 },
};

export const enterAnimationFast = {
	initial: { opacity: 0, y: -30, scale: 0.8 },
	whileInView: { opacity: 1, y: 0, scale: 1 },
	transition: { duration: 0.4 },
	viewport: { once: true },
};

export const fadeInAnimation = {
	initial: { opacity: 0 },
	whileInView: { opacity: 1 },
	transition: { duration: 0.5 },
	viewport: { once: true },
};

export const containerVariants = {
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.3,
		},
	},
};

export const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const cvContainerVariants = {
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.12,
		},
	},
};

export const cvItemVariants = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

export const tileEntryExit = {
	initial: { opacity: 0, scale: 0, transition: { duration: 0.15 } },
	animate: { opacity: 1, scale: 1, transition: { duration: 0.15 } },
	exit: { opacity: 0, scale: 0, transition: { duration: 0.15 } },
	layout: true,
};
