import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

export interface FormTagListProps {
	className?: string;
	fieldName: string;
	label: string;
	maxTags?: number;
}

export function FormTagList({ fieldName, className, label, maxTags = 20 }: FormTagListProps) {
	const form = useFormContext();
	const tags: string[] = form.watch(fieldName) || [];
	const [inputValue, setInputValue] = useState("");
	const [isFocused, setIsFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	const setTags = (newTags: string[]) => {
		form.setValue(fieldName, newTags, { shouldDirty: true, shouldValidate: true });
	};

	const addTag = () => {
		const trimmedInput = inputValue.trim();
		if (trimmedInput && !tags.includes(trimmedInput) && tags.length < maxTags) {
			setTags([...tags, trimmedInput]);
			setInputValue("");
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addTag();
		} else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
			setTags(tags.slice(0, -1));
		}
	};

	const removeTag = (indexToRemove: number) => {
		setTags(tags.filter((_, index) => index !== indexToRemove));
	};

	const focusInput = () => {
		inputRef.current?.focus();
	};

	return (
		<div className={cn("space-y-2", className)}>
			<div className="flex justify-between items-center">
				<FormLabel className="text-xs font-medium text-muted-foreground">{label}</FormLabel>
				{maxTags && (
					<span className="text-xs text-muted-foreground">
						{tags.length}/{maxTags}
					</span>
				)}
			</div>

			<div
				className={cn(
					"flex flex-wrap gap-2 p-2 border rounded-md min-h-[42px] bg-background",
					isFocused ? "ring-2 ring-ring border-gray-300" : "border-gray-200",
				)}
				onClick={focusInput}
				role="button"
				tabIndex={0}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						focusInput();
					}
				}}
			>
				{tags.map((tag, index) => (
					<div
						key={index}
						className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md group"
					>
						<span className="text-sm">{tag}</span>
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								removeTag(index);
							}}
							className="text-muted-foreground hover:text-destructive focus:outline-none"
							aria-label={`Remove ${tag}`}
						>
							<X className="h-3.5 w-3.5" />
						</button>
					</div>
				))}

				<div className="flex-1 min-w-[120px] relative">
					<div className="flex items-center">
						<Input
							ref={inputRef}
							type="text"
							value={inputValue}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							placeholder=""
							className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7 text-sm bg-transparent"
						/>
						{inputValue === "" && !isFocused && tags.length === 0 && (
							<div
								className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none flex items-center text-muted-foreground text-sm pl-2 gap-2"
								style={{ zIndex: 1 }}
							>
								Type and submit with<Kbd>↵ Enter</Kbd>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default FormTagList;
