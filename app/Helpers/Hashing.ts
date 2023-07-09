/** @format */

import crypto from "node:crypto";

const HashOptions = [
	"gost-mac",
	"md4",
	"md5",
	"md_gost94",
	"ripemd160",
	"sha1",
	"sha224",
	"sha256",
	"sha384",
	"sha512",
	"streebog256",
	"streebog512",
	"whirlpool",
] as const;
type HashTypes = (typeof HashOptions)[number];

/**
 *
 * @param hashType - Hash type to use
 * @param environString - Environment string to hash with
 * @param body - Body to hash
 * @param requestHeader - Request header to compare to
 *
 * @returns if no requestHeader is provided will return the hashed string, otherwise reutrns boolean;
 */
export function CheckHash({
	hashType,
	environString,
	body,
	signature,
}: {
	hashType: HashTypes;
	environString: string;
	body: string | Record<string, unknown>;
	signature: string | null;
}) {
	const our_signature = `${hashType}=${crypto
		.createHmac(`${hashType}`, environString)
		.update(typeof body === "string" ? body : JSON.stringify(body))
		.digest("hex")}`;
	if (our_signature === signature) {
		return true;
	}
	return false;
}

/**
 * Almost the same as above method, made to make type safety easier. Will only return hashString
 */
export function CreateHash({
	hashType,
	environString,
	body,
}: {
	hashType: HashTypes;
	environString: string;
	body: string | Record<string, unknown>;
}) {
	const signature = `${hashType}=${crypto
		.createHmac(`${hashType}`, environString)
		.update(typeof body === "string" ? body : JSON.stringify(body))
		.digest("hex")}`;
	return signature;
}
