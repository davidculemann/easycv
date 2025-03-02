import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCV } from "@/hooks/api-hooks/useCV";
import { FilePlus } from "lucide-react";

export default function CVs() {
	const { cvs } = useCV();

	const { createCV } = useCV();

	const handleCreateCV = () => {
		createCV();
	};

	return (
		<div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			<Card className="flex flex-col items-center justify-center w-48 h-48" onClick={handleCreateCV}>
				<CardHeader>
					<CardTitle>Create New CV</CardTitle>
				</CardHeader>
				<CardContent>
					<FilePlus className="w-18 h-18 " />
				</CardContent>
			</Card>
			{cvs?.map((cv: any) => (
				<Card key={cv.id}>
					<CardHeader>
						<CardTitle>{cv.title}</CardTitle>
					</CardHeader>
				</Card>
			))}
		</div>
	);
}
