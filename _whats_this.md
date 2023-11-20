# What's this

The SST (Serverless Stack) framework is designed to build serverless applications using AWS services. The app is setup as a monorepo, managed with `pnpm`, which is a fast, disk space-efficient package manager. Below is an analysis of each directory, focusing on their roles, scopes, and any additional considerations.

## Directory Structure

- [/](#\/)
- [/stacks](#stacks)
- [/stacks/tests](#stackstests)
- [/packages](#packages)
- [/packages/core/src](#packagescoresrc)
- [/packages/frontend](#packagesfrontend)
- [packages/functions](#functionspackage)
- [/packages/functions/src](#functionssrc)
- [/packages/functions/migrations](#functionsmigrations)

### /

The route folder for the contains pacakgemanagement and configuration files.

### /stacks

This directory typically contains the infrastructure-as-code (IaC) definitions for your serverless application. In SST, stacks are defined using AWS CDK (Cloud Development Kit), and they describe the AWS resources your application will use (like Lambda functions, DynamoDB tables, API Gateways, etc.).

- **Scope:**
Global infrastructure setup and configuration.

### /stacks/tests

Tests on infrastructure code.

### /packages

This is the root directory for all your application's packages in a monorepo setup. It helps in organizing different parts of your application (like frontend, backend, core libraries) into separate packages.

- **Scope:** Contains all the separate modules/packages of your application.

### /packages/core/src

The core package is likely intended for shared logic, models, or utilities that are used across other packages. This could include shared data models, utility functions, or business logic.

- **Scope:** Shared resources and logic across the application.

- **Considerations:** Ensure that dependencies are well-managed to avoid version conflicts, especially in a monorepo setup.

### /packages/frontend

This package contains the frontend part of your application, built with a framework like React, Vue, or SvelteKit. It's separated from the backend logic, following a microservices or serverless architecture.

- **Scope:** User interface and client-side logic.

### /packages/functions

This package contains AWS Lambda functions and related serverless backend logic. It's where you define the server-side functionality of your application.

### /packages/functions/src

Contains the actual Lambda function code and handlers.

### /packages/functions/migrations

Used for database migration scripts, ensuring your database schema is up-to-date and consistent with your application's data models.

- **Scope:** Server-side logic and data handling.

### Considerations for `pnpm` in a Monorepo

- **Workspace Management:** Ensure that `pnpm` workspaces are correctly configured to manage dependencies across packages efficiently.
- **Versioning:** Consistent versioning across packages is crucial, especially for shared dependencies.
- **Local Dependencies:** Leverage `pnpm`'s ability to link local packages for seamless development across different parts of your application.