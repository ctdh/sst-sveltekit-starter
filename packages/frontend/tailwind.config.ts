
import type { Config } from 'tailwindcss';
import { myCustomTheme } from './pwaTheme'

// 1. Import the Skeleton plugin
import { skeleton } from '@skeletonlabs/tw-plugin';

import forms from '@tailwindcss/forms';

const config = {
	// 2. Opt for dark mode to be handled via the class method
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		// 3. Append the path to the Skeleton package
		// The hardcoded path to the Skeleton package files might cause 
		// issues if the structure of your node_modules directory changes. 
		// It's generally better to use require.resolve to get the path to 
		// a module, as this will always return the correct path regardless 
		// of the environment or project setup.
		'./node_modules/@skeletonlabs/skeleton/../**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		extend: {},
	},
	plugins: [
		forms,
		require('flowbite/plugin'),
		// 4. Append the Skeleton plugin (after other plugins)
		skeleton({
			themes: { 
				preset: [ "skeleton" ], 
				custom: [
					myCustomTheme,
				]
			},
		})
	]
} satisfies Config;

export default config;
						