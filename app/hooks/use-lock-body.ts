import { useLayoutEffect } from "react";

// @see https://usehooks.com/useLockBodyScroll.
export function useLockBody() {
	useLayoutEffect((): (() => void) => {
		const originalStyle: string = window.getComputedStyle(document.body).overflow;
		document.body.style.overflow = "hidden";
		return () => (document.body.style.overflow = originalStyle);
	}, []);
}
