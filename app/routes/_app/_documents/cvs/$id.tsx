import { useParams } from "@remix-run/react";

export default function CV() {
	const params = useParams();
	console.log(params);

	return <div>{params.id}</div>;
}
