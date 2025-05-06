import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function validateEmail(email: string | undefined) {
	if (!email) return false;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function validatePassword(password: string | undefined) {
	if (!password) return false;
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
	return passwordRegex.test(password);
}

export function validatePhone(phone: string | undefined) {
	if (!phone) return false;

	const cleanedPhone = phone.replace(/\D/g, "");

	if (cleanedPhone.length === 11 && cleanedPhone.startsWith("0")) {
		return true;
	}

	if (cleanedPhone.length === 10) {
		return true;
	}

	if (cleanedPhone.length >= 11 && cleanedPhone.length <= 12) {
		return true;
	}

	return false;
}
