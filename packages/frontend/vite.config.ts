import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';
import path from 'path';

export default defineConfig({
    plugins: [
        sveltekit(),
        purgeCss({
            safelist: {
                // any selectors that begin with "hljs-" will not be purged
                greedy: [/^hljs-/],
            }
        })
    ],
    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },
    resolve: {
        alias: {
            $shared_types: path.resolve(__dirname, '../types/src/'),
        }
    }
});
