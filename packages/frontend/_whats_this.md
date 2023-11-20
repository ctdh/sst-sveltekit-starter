# What's this?

This folder has the server side functions for the SvelteKit app. Whereas you could access the db directly from here, it is probably better practice to use the API endpoints.

## Directory Structure

This is the directory structure in the [/packages/frontend](./_whats_this.md#) folder.

- [\/](#\\/)
- [/src](#src)
- [/src/lib](#srclib)
- [/src/lib/stores](#srclibstores)
- [/src/routes](#srcroutes)
- [/src/static](#srcstatic)
- [/src/tests](#srctests)
- [/src/components](#srccomponents)
- [/src/hooks](#srchooks)
- [/src/utils](#srcutils)
- [/src/types](#srctypes)

### \/

This is the root of your SvelteKit application. It typically contains configuration files like svelte.config.js, package.json, .gitignore, and any other configuration files necessary for your project (like tsconfig.json for TypeScript).

### \/src

This is the main source directory for your SvelteKit application. It contains all the Svelte components, libraries, and assets that make up your application.

### \/src/lib

This directory is used for storing reusable Svelte components or JavaScript modules. It's a convention in SvelteKit to keep your shared components and utility functions here.

### \/src/lib/stores

This is a subdirectory within /lib specifically for Svelte stores. Svelte stores are used for managing app-wide state. Keeping them in a separate stores directory helps with organization, especially as your application grows.

### \/src/routes

This directory contains your SvelteKit pages and endpoints. The file structure within this directory directly maps to your application's routing.

### \/src/static

This directory is for static assets that should not be processed by SvelteKit. These might include images, fonts, and other static files. They are served as-is from the root URL.

### \/src/tests

This directory is for your test files. It's good practice to have a separate directory for tests to keep them organized and separate from your application code.

### \/src/components

For larger projects, you might want to separate your reusable Svelte components from other library code. This directory would be specifically for those components.

### \/src/hooks

If you're using SvelteKit hooks (like handle, getSession, etc.), you might want to organize them into a separate directory for clarity.

### \/src/utils

For utility functions or helper modules that are used across different components or routes.

### \/src/types

If you're using TypeScript, it's beneficial to have a directory for TypeScript type definitions, especially for types that are used across different components or modules.
