/** @format */
//import { typedjson, useTypedLoaderData } from "remix-typedjson";

/* export const loader = () => {
	const routes = Deno.readDirSync("./app/routes");
	const route_list = [];
	for (const route of routes) {
		if (route.name.includes("logs")) {
			const split = route.name.replace(".tsx", "").split(".")[1];
			if (split) route_list.push(split);
		}
	}
	return typedjson({ route_list });
}; */

const LogsRoute = () => {
	//const { route_list } = useTypedLoaderData<typeof loader>();
	return (
		<div className="w-full flex flex-col items-center gap-3">
			{/* 			{route_list.map((route, i) => {
				return <a href={`/logs/${route}`}>{route}</a>;
			})} */}
			<a href="/logs/time">time</a>
			<a href="/logs/route">route</a>
			<a href="/logs/visitors">visitors</a>
		</div>
	);
};

export default LogsRoute;
