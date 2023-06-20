/** @format */

export const CreateConditionalClass = (
	condition?: boolean,
	defaults?: string,
	given?: string
) => {
	return condition && (given || defaults);
};

export const CreateClasses = (defaults: ClassOptions, given?: ClassOptions) => {
	if (given) {
		const merged = Object.assign({}, defaults, given);
		return Object.keys(merged).map(key => {
			return [merged[key]];
		});
	}
	return Object.keys(defaults).map(key => {
		return [defaults[key]];
	});
};

export const SafeRefNumber = (dimension: number | undefined, fallback = 0) => {
	return dimension || fallback;
};

export const SafeRefScaled = (dimension: number | undefined, fallback = 0) => {
	return (dimension || fallback) - (dimension || fallback) * 0.2;
};

export interface ClassOptions extends Record<string, string | undefined> {
	h?: string;
	w?: string;
	bg?: string;
	text?: string;
	focus?: string;
	rounded?: string;
	opacity?: string;
	shadow?: string;
	transition?: string;
	p?: string;
	duration?: string;
	align?: string;
	display?: string;
	position?: string;
	z?: string;
	disabled?: string;
	hover?: string;
	active?: string;
	before?: string;
	after?: string;
	focus_visible?: string;
	animate?: string;
	cursor?: string;
	overflow?: string;
}
