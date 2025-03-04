import { useParams } from "@remix-run/react";

export default function CV() {
	const params = useParams();

	return <div>{params.id}</div>;
}
