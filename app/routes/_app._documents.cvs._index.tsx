import PageButton from "@/components/shared/page-button";
import { useCV } from "@/hooks/api-hooks/useCV";
import { useNavigate } from "@remix-run/react";
import { AnimatePresence } from "motion/react";

export default function CVs() {
	const { cvs } = useCV();
	const navigate = useNavigate();
	const { createCV } = useCV();

	const handleCreateCV = () => {
		createCV();
	};

	const handleOpenCV = (id: string) => {
		navigate(`/cvs/${id}`);
	};

	return (
		<div className="p-4  gap-4 flex flex-wrap">
			<AnimatePresence>
				<PageButton onClick={handleCreateCV}>Create New CV</PageButton>
				{cvs?.map((cv: any) => (
					<PageButton key={cv.id} onClick={() => handleOpenCV(cv.id)}>
						{cv.title}
					</PageButton>
				))}
			</AnimatePresence>
		</div>
	);
}
