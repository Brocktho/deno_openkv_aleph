/** @format */

import type { Config } from "tailwindcss";

export default {
	content: ["./app/**/*.{js,jsx,ts,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			opacity: {
				hover: "0.08",
				focus: "0.12",
				active: "0.12",
				drag: "0.16",
				disabled: "0.38",
			},
			colors: {
				"--md-source": "hsl(var(--md-source) / 1)",
				primary0: "hsl(var(--md-ref-palette-primary0) / 1)",
				primary10: "hsl(var(--md-ref-palette-primary10) / 1)",
				primary20: "hsl(var(--md-ref-palette-primary20) / 1)",
				primary30: "hsl(var(--md-ref-palette-primary30) / 1)",
				primary40: "hsl(var(--md-ref-palette-primary40) / 1)",
				primary50: "hsl(var(--md-ref-palette-primary50) / 1)",
				primary60: "hsl(var(--md-ref-palette-primary60) / 1)",
				primary70: "hsl(var(--md-ref-palette-primary70) / 1)",
				primary80: "hsl(var(--md-ref-palette-primary80) / 1)",
				primary90: "hsl(var(--md-ref-palette-primary90) / 1)",
				primary95: "hsl(var(--md-ref-palette-primary95) / 1)",
				primary99: "hsl(var(--md-ref-palette-primary99) / 1)",
				primary100: "hsl(var(--md-ref-palette-primary100) / 1)",
				secondary0: "hsl(var(--md-ref-palette-secondary0) / 1)",
				secondary10: "hsl(var(--md-ref-palette-secondary10) / 1)",
				secondary20: "hsl(var(--md-ref-palette-secondary20) / 1)",
				secondary30: "hsl(var(--md-ref-palette-secondary30) / 1)",
				secondary40: "hsl(var(--md-ref-palette-secondary40) / 1)",
				secondary50: "hsl(var(--md-ref-palette-secondary50) / 1)",
				secondary60: "hsl(var(--md-ref-palette-secondary60) / 1)",
				secondary70: "hsl(var(--md-ref-palette-secondary70) / 1)",
				secondary80: "hsl(var(--md-ref-palette-secondary80) / 1)",
				secondary90: "hsl(var(--md-ref-palette-secondary90) / 1)",
				secondary95: "hsl(var(--md-ref-palette-secondary95) / 1)",
				secondary99: "hsl(var(--md-ref-palette-secondary99) / 1)",
				secondary100: "hsl(var(--md-ref-palette-secondary100) / 1)",
				tertiary0: "hsl(var(--md-ref-palette-tertiary0) / 1)",
				tertiary10: "hsl(var(--md-ref-palette-tertiary10) / 1)",
				tertiary20: "hsl(var(--md-ref-palette-tertiary20) / 1)",
				tertiary30: "hsl(var(--md-ref-palette-tertiary30) / 1)",
				tertiary40: "hsl(var(--md-ref-palette-tertiary40) / 1)",
				tertiary50: "hsl(var(--md-ref-palette-tertiary50) / 1)",
				tertiary60: "hsl(var(--md-ref-palette-tertiary60) / 1)",
				tertiary70: "hsl(var(--md-ref-palette-tertiary70) / 1)",
				tertiary80: "hsl(var(--md-ref-palette-tertiary80) / 1)",
				tertiary90: "hsl(var(--md-ref-palette-tertiary90) / 1)",
				tertiary95: "hsl(var(--md-ref-palette-tertiary95) / 1)",
				tertiary99: "hsl(var(--md-ref-palette-tertiary99) / 1)",
				tertiary100: "hsl(var(--md-ref-palette-tertiary100) / 1)",
				error0: "hsl(var(--md-ref-palette-error0) / 1)",
				error10: "hsl(var(--md-ref-palette-error10) / 1)",
				error20: "hsl(var(--md-ref-palette-error20) / 1)",
				error30: "hsl(var(--md-ref-palette-error30) / 1)",
				error40: "hsl(var(--md-ref-palette-error40) / 1)",
				error50: "hsl(var(--md-ref-palette-error50) / 1)",
				error60: "hsl(var(--md-ref-palette-error60) / 1)",
				error70: "hsl(var(--md-ref-palette-error70) / 1)",
				error80: "hsl(var(--md-ref-palette-error80) / 1)",
				error90: "hsl(var(--md-ref-palette-error90) / 1)",
				error95: "hsl(var(--md-ref-palette-error95) / 1)",
				error99: "hsl(var(--md-ref-palette-error99) / 1)",
				error100: "hsl(var(--md-ref-palette-error100) / 1)",
				neutral0: "hsl(var(--md-ref-palette-neutral0) / 1)",
				neutral10: "hsl(var(--md-ref-palette-neutral10) / 1)",
				neutral20: "hsl(var(--md-ref-palette-neutral20) / 1)",
				neutral30: "hsl(var(--md-ref-palette-neutral30) / 1)",
				neutral40: "hsl(var(--md-ref-palette-neutral40) / 1)",
				neutral50: "hsl(var(--md-ref-palette-neutral50) / 1)",
				neutral60: "hsl(var(--md-ref-palette-neutral60) / 1)",
				neutral70: "hsl(var(--md-ref-palette-neutral70) / 1)",
				neutral80: "hsl(var(--md-ref-palette-neutral80) / 1)",
				neutral90: "hsl(var(--md-ref-palette-neutral90) / 1)",
				neutral95: "hsl(var(--md-ref-palette-neutral95) / 1)",
				neutral99: "hsl(var(--md-ref-palette-neutral99) / 1)",
				neutral100: "hsl(var(--md-ref-palette-neutral100) / 1)",
				"neutral-variant0":
					"hsl(var(--md-ref-palette-neutral-variant0) / 1)",
				"neutral-variant10":
					"hsl(var(--md-ref-palette-neutral-variant10) / 1)",
				"neutral-variant20":
					"hsl(var(--md-ref-palette-neutral-variant20) / 1)",
				"neutral-variant30":
					"hsl(var(--md-ref-palette-neutral-variant30) / 1)",
				"neutral-variant40":
					"hsl(var(--md-ref-palette-neutral-variant40) / 1)",
				"neutral-variant50":
					"hsl(var(--md-ref-palette-neutral-variant50) / 1)",
				"neutral-variant60":
					"hsl(var(--md-ref-palette-neutral-variant60) / 1)",
				"neutral-variant70":
					"hsl(var(--md-ref-palette-neutral-variant70) / 1)",
				"neutral-variant80":
					"hsl(var(--md-ref-palette-neutral-variant80) / 1)",
				"neutral-variant90":
					"hsl(var(--md-ref-palette-neutral-variant90) / 1)",
				"neutral-variant95":
					"hsl(var(--md-ref-palette-neutral-variant95) / 1)",
				"neutral-variant99":
					"hsl(var(--md-ref-palette-neutral-variant99) / 1)",
				"neutral-variant100":
					"hsl(var(--md-ref-palette-neutral-variant100) / 1)",
				"primary-light": "hsl(var(--md-sys-color-primary-light) / 1)",
				"on-primary-light":
					"hsl(var(--md-sys-color-on-primary-light) / 1)",
				"primary-container-light":
					"hsl(var(--md-sys-color-primary-container-light) / 1)",
				"on-primary-container-light":
					"hsl(var(--md-sys-color-on-primary-container-light) / 1)",
				"secondary-light":
					"hsl(var(--md-sys-color-secondary-light) / 1)",
				"on-secondary-light":
					"hsl(var(--md-sys-color-on-secondary-light) / 1)",
				"secondary-container-light":
					"hsl(var(--md-sys-color-secondary-container-light) / 1)",
				"on-secondary-container-light":
					"hsl(var(--md-sys-color-on-secondary-container-light) / 1)",
				"tertiary-light": "hsl(var(--md-sys-color-tertiary-light) / 1)",
				"on-tertiary-light":
					"hsl(var(--md-sys-color-on-tertiary-light) / 1)",
				"tertiary-container-light":
					"hsl(var(--md-sys-color-tertiary-container-light) / 1)",
				"on-tertiary-container-light":
					"hsl(var(--md-sys-color-on-tertiary-container-light) / 1)",
				"error-light": "hsl(var(--md-sys-color-error-light) / 1)",
				"on-error-light": "hsl(var(--md-sys-color-on-error-light) / 1)",
				"error-container-light":
					"hsl(var(--md-sys-color-error-container-light) / 1)",
				"on-error-container-light":
					"hsl(var(--md-sys-color-on-error-container-light) / 1)",
				"outline-light": "hsl(var(--md-sys-color-outline-light) / 1)",
				"background-light":
					"hsl(var(--md-sys-color-background-light) / 1)",
				"on-background-light":
					"hsl(var(--md-sys-color-on-background-light) / 1)",
				"surface-light": "hsl(var(--md-sys-color-surface-light) / 1)",
				"on-surface-light":
					"hsl(var(--md-sys-color-on-surface-light) / 1)",
				"surface-variant-light":
					"hsl(var(--md-sys-color-surface-variant-light) / 1)",
				"on-surface-variant-light":
					"hsl(var(--md-sys-color-on-surface-variant-light) / 1)",
				"inverse-surface-light":
					"hsl(var(--md-sys-color-inverse-surface-light) / 1)",
				"inverse-on-surface-light":
					"hsl(var(--md-sys-color-inverse-on-surface-light) / 1)",
				"inverse-primary-light":
					"hsl(var(--md-sys-color-inverse-primary-light) / 1)",
				"shadow-light": "hsl(var(--md-sys-color-shadow-light) / 1)",
				"surface-tint-light":
					"hsl(var(--md-sys-color-surface-tint-light) / 1)",
				"outline-variant-light":
					"hsl(var(--md-sys-color-outline-variant-light) / 1)",
				"scrim-light": "hsl(var(--md-sys-color-scrim-light) / 1)",
				"primary-dark": "hsl(var(--md-sys-color-primary-dark) / 1)",
				"on-primary-dark":
					"hsl(var(--md-sys-color-on-primary-dark) / 1)",
				"primary-container-dark":
					"hsl(var(--md-sys-color-primary-container-dark) / 1)",
				"on-primary-container-dark":
					"hsl(var(--md-sys-color-on-primary-container-dark) / 1)",
				"secondary-dark": "hsl(var(--md-sys-color-secondary-dark) / 1)",
				"on-secondary-dark":
					"hsl(var(--md-sys-color-on-secondary-dark) / 1)",
				"secondary-container-dark":
					"hsl(var(--md-sys-color-secondary-container-dark) / 1)",
				"on-secondary-container-dark":
					"hsl(var(--md-sys-color-on-secondary-container-dark) / 1)",
				"tertiary-dark": "hsl(var(--md-sys-color-tertiary-dark) / 1)",
				"on-tertiary-dark":
					"hsl(var(--md-sys-color-on-tertiary-dark) / 1)",
				"tertiary-container-dark":
					"hsl(var(--md-sys-color-tertiary-container-dark) / 1)",
				"on-tertiary-container-dark":
					"hsl(var(--md-sys-color-on-tertiary-container-dark) / 1)",
				"error-dark": "hsl(var(--md-sys-color-error-dark) / 1)",
				"on-error-dark": "hsl(var(--md-sys-color-on-error-dark) / 1)",
				"error-container-dark":
					"hsl(var(--md-sys-color-error-container-dark) / 1)",
				"on-error-container-dark":
					"hsl(var(--md-sys-color-on-error-container-dark) / 1)",
				"outline-dark": "hsl(var(--md-sys-color-outline-dark) / 1)",
				"background-dark":
					"hsl(var(--md-sys-color-background-dark) / 1)",
				"on-background-dark":
					"hsl(var(--md-sys-color-on-background-dark) / 1)",
				"surface-dark": "hsl(var(--md-sys-color-surface-dark) / 1)",
				"on-surface-dark":
					"hsl(var(--md-sys-color-on-surface-dark) / 1)",
				"surface-variant-dark":
					"hsl(var(--md-sys-color-surface-variant-dark) / 1)",
				"on-surface-variant-dark":
					"hsl(var(--md-sys-color-on-surface-variant-dark) / 1)",
				"inverse-surface-dark":
					"hsl(var(--md-sys-color-inverse-surface-dark) / 1)",
				"inverse-on-surface-dark":
					"hsl(var(--md-sys-color-inverse-on-surface-dark) / 1)",
				"inverse-primary-dark":
					"hsl(var(--md-sys-color-inverse-primary-dark) / 1)",
				"shadow-dark": "hsl(var(--md-sys-color-shadow-dark) / 1)",
				"surface-tint-dark":
					"hsl(var(--md-sys-color-surface-tint-dark) / 1)",
				"outline-variant-dark":
					"hsl(var(--md-sys-color-outline-variant-dark) / 1)",
				"scrim-dark": "hsl(var(--md-sys-color-scrim-dark) / 1)",
			},
			keyframes: {
				pulsing: {
					"0%, 100%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.1)" },
				},
			},
			animation: {
				pulsing: "pulsing 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
			},
		},
	},
	plugins: [],
} satisfies Config;
