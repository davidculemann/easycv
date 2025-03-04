import { Button } from "../ui/button";

export default function PageButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
	return (
		<Button onClick={onClick} variant="outline" className="h-64 w-48">
			{children}
		</Button>
	);
}
