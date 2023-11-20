
import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const myCustomTheme: CustomThemeConfig = {
		
    name: 'my-custom-theme',
    properties: {
		// =~= Theme Properties =~=
		"--theme-font-family-base": `system-ui`,
		"--theme-font-family-heading": `system-ui`,
		"--theme-font-color-base": "0 0 0",
		"--theme-font-color-dark": "255 255 255",
		"--theme-rounded-base": "8px",
		"--theme-rounded-container": "4px",
		"--theme-border-base": "1px",
		// =~= Theme On-X Colors =~=
		"--on-primary": "255 255 255",
		"--on-secondary": "255 255 255",
		"--on-tertiary": "0 0 0",
		"--on-success": "0 0 0",
		"--on-warning": "0 0 0",
		"--on-error": "255 255 255",
		"--on-surface": "255 255 255",
		// =~= Theme Colors  =~=
		// primary | #1c407b 
		"--color-primary-50": "221 226 235", // #dde2eb
		"--color-primary-100": "210 217 229", // #d2d9e5
		"--color-primary-200": "198 207 222", // #c6cfde
		"--color-primary-300": "164 179 202", // #a4b3ca
		"--color-primary-400": "96 121 163", // #6079a3
		"--color-primary-500": "28 64 123", // #1c407b
		"--color-primary-600": "25 58 111", // #193a6f
		"--color-primary-700": "21 48 92", // #15305c
		"--color-primary-800": "17 38 74", // #11264a
		"--color-primary-900": "14 31 60", // #0e1f3c
		// secondary | #2A60B7 
		"--color-secondary-50": "223 231 244", // #dfe7f4
		"--color-secondary-100": "212 223 241", // #d4dff1
		"--color-secondary-200": "202 215 237", // #cad7ed
		"--color-secondary-300": "170 191 226", // #aabfe2
		"--color-secondary-400": "106 144 205", // #6a90cd
		"--color-secondary-500": "42 96 183", // #2A60B7
		"--color-secondary-600": "38 86 165", // #2656a5
		"--color-secondary-700": "32 72 137", // #204889
		"--color-secondary-800": "25 58 110", // #193a6e
		"--color-secondary-900": "21 47 90", // #152f5a
		// tertiary | #0EA5E9 
		"--color-tertiary-50": "219 242 252", // #dbf2fc
		"--color-tertiary-100": "207 237 251", // #cfedfb
		"--color-tertiary-200": "195 233 250", // #c3e9fa
		"--color-tertiary-300": "159 219 246", // #9fdbf6
		"--color-tertiary-400": "86 192 240", // #56c0f0
		"--color-tertiary-500": "14 165 233", // #0EA5E9
		"--color-tertiary-600": "13 149 210", // #0d95d2
		"--color-tertiary-700": "11 124 175", // #0b7caf
		"--color-tertiary-800": "8 99 140", // #08638c
		"--color-tertiary-900": "7 81 114", // #075172
		// success | #13d110 
		"--color-success-50": "220 248 219", // #dcf8db
		"--color-success-100": "208 246 207", // #d0f6cf
		"--color-success-200": "196 244 195", // #c4f4c3
		"--color-success-300": "161 237 159", // #a1ed9f
		"--color-success-400": "90 223 88", // #5adf58
		"--color-success-500": "19 209 16", // #13d110
		"--color-success-600": "17 188 14", // #11bc0e
		"--color-success-700": "14 157 12", // #0e9d0c
		"--color-success-800": "11 125 10", // #0b7d0a
		"--color-success-900": "9 102 8", // #096608
		// warning | #EAB308 
		"--color-warning-50": "252 244 218", // #fcf4da
		"--color-warning-100": "251 240 206", // #fbf0ce
		"--color-warning-200": "250 236 193", // #faecc1
		"--color-warning-300": "247 225 156", // #f7e19c
		"--color-warning-400": "240 202 82", // #f0ca52
		"--color-warning-500": "234 179 8", // #EAB308
		"--color-warning-600": "211 161 7", // #d3a107
		"--color-warning-700": "176 134 6", // #b08606
		"--color-warning-800": "140 107 5", // #8c6b05
		"--color-warning-900": "115 88 4", // #735804
		// error | #d21950 
		"--color-error-50": "248 221 229", // #f8dde5
		"--color-error-100": "246 209 220", // #f6d1dc
		"--color-error-200": "244 198 211", // #f4c6d3
		"--color-error-300": "237 163 185", // #eda3b9
		"--color-error-400": "224 94 133", // #e05e85
		"--color-error-500": "210 25 80", // #d21950
		"--color-error-600": "189 23 72", // #bd1748
		"--color-error-700": "158 19 60", // #9e133c
		"--color-error-800": "126 15 48", // #7e0f30
		"--color-error-900": "103 12 39", // #670c27
		// surface | #646d87 
		"--color-surface-50": "232 233 237", // #e8e9ed
		"--color-surface-100": "224 226 231", // #e0e2e7
		"--color-surface-200": "216 219 225", // #d8dbe1
		"--color-surface-300": "193 197 207", // #c1c5cf
		"--color-surface-400": "147 153 171", // #9399ab
		"--color-surface-500": "100 109 135", // #646d87
		"--color-surface-600": "90 98 122", // #5a627a
		"--color-surface-700": "75 82 101", // #4b5265
		"--color-surface-800": "60 65 81", // #3c4151
		"--color-surface-900": "49 53 66", // #313542
		
	}
}