/** @format */

export const InvalidMethod = () => {
	return new Response("Invalid Method", {
		status: 405,
		headers: { "content-type": "text/plain" },
	});
};
