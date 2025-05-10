import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";

export interface FormTagListProps {
	className?: string;
	fieldName: string;
	label: string;
	maxTags?: number;
	placeholder?: string;
}

export function FormTagList({
	fieldName,
	className,
	label,
	maxTags = 20,
	placeholder = "Type and press Enter",
}: FormTagListProps) {
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
				<FormLabel>{label}</FormLabel>
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

				<div className="flex-1 min-w-[120px]">
					<div className="flex items-center">
						<Input
							ref={inputRef}
							type="text"
							value={inputValue}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							placeholder={tags.length === 0 ? placeholder : ""}
							className="border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-7 text-sm"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default FormTagList;
