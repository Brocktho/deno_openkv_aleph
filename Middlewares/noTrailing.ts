/** @format */

export default function NoTrailing(req: Request) {
	const url = new URL(req.url);
	const path = url.pathname;
	if (path.endsWith("/") && path.length > 1) {
		const query = url.search;
		const safePath = path.slice(0, -1).replace(/\/+/g, "/");
		const headers = new Headers();
		headers.append("Location", `${safePath}${query}`);
		const resp = new Response("No Trailing Slashes", {
			headers,
			status: 301,
		});
		return resp;
	}
	return null;
}
