import { AspectRatio } from "../ui/aspect-ratio";
import { Button } from "../ui/button";

export default function PageButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
	return (
		<AspectRatio ratio={210 / 297}>
			<Button onClick={onClick}>{children}</Button>
		</AspectRatio>
	);
}
