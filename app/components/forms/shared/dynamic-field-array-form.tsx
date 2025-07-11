import { Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFieldArray } from "react-hook-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { EntryFormSection, type EntryFormSectionConfig } from "./entry-form-section";

interface DynamicFieldArrayFormProps {
	form: any;
	arrayName: string;
	emptyEntry: any;
	config: EntryFormSectionConfig;
	getDisplayTitle: (entry: any) => string;
	getDisplaySubtitle?: (entry: any, startDateStr: string, endDateStr: string, isCurrent: boolean) => string;
	dateFormat?: (date: string) => string;
}

export function DynamicFieldArrayForm({
	form,
	arrayName,
	emptyEntry,
	config,
	getDisplayTitle,
	getDisplaySubtitle,
	dateFormat = (date) => date,
}: DynamicFieldArrayFormProps) {
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: arrayName,
	});
	const entries = form.watch(arrayName);
	const [openItemId, setOpenItemId] = useState<string | undefined>();
	const prevFieldsLength = useRef(fields.length);

	useEffect(() => {
		if (fields.length > prevFieldsLength.current) {
			const lastId = fields[fields.length - 1]?.id;
			if (lastId) setOpenItemId(lastId);
		}
		prevFieldsLength.current = fields.length;
	}, [fields]);

	const currentIndex = entries.findIndex((entry: any) => entry.current);

	function onAddEntry() {
		append(emptyEntry);
	}

	return (
		<>
			<Accordion type="single" collapsible className="w-full" value={openItemId} onValueChange={setOpenItemId}>
				{fields.map((field, index) => {
					const entry = entries[index] || {};
					const startDateStr = entry.startDate ? dateFormat(entry.startDate) : "";
					const endDateStr = entry.endDate ? dateFormat(entry.endDate) : "";
					const isCurrent = !!entry.current;
					return (
						<AccordionItem
							key={field.id}
							value={field.id}
							className="bg-card rounded-lg border shadow-sm mb-6"
						>
							<AccordionTrigger className="px-4 cursor-pointer select-none rounded-t-lg hover:bg-muted/50 gap-2">
								<div className="flex flex-col text-left w-full">
									<div className="font-medium text-base">
										{getDisplayTitle(entry) || (
											<span className="text-muted-foreground">New Entry</span>
										)}
									</div>
									{getDisplaySubtitle && (
										<div className="text-xs text-muted-foreground">
											{getDisplaySubtitle(entry, startDateStr, endDateStr, isCurrent)}
										</div>
									)}
								</div>
								<div
									role="button"
									tabIndex={0}
									aria-label="Delete entry"
									className="ml-auto flex items-center justify-center rounded-md p-2 hover:bg-muted/50 focus:bg-muted/50 cursor-pointer"
									onClick={(e) => {
										e.stopPropagation();
										remove(index);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											remove(index);
										}
									}}
								>
									<Trash2 className="h-4 w-4 text-muted-foreground" />
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-4 pt-0">
								<EntryFormSection
									form={form}
									fieldPrefix={`${arrayName}.${index}`}
									config={config}
									index={index}
									isCurrent={isCurrent}
									currentIndex={currentIndex}
								/>
							</AccordionContent>
						</AccordionItem>
					);
				})}
			</Accordion>
			<Button
				type="button"
				variant="outline"
				onClick={onAddEntry}
				className="w-full max-w-md mx-auto flex items-center justify-center"
			>
				<Plus className="mr-2 h-4 w-4" />
				Add Entry
			</Button>
		</>
	);
}
