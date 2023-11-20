# Starter Pack Requirements - Svelte

This starter pack is desigend to allow rapid deployemnt of a Svelte application with a number of optional components, where appropriate the components should be sufficiently isolated they can be readily dropped if they are not required.

The package is to exemplify best practice.

## Infrastructure

API
Storage (S3, PostgreSQL DB, DynamoDb)
SveltKit Frontend
Auth (Linkadaptor, Google, Github)
AWS SES

## Frontend

SvelteKit
TailwindCSS
SkeletonUI
FlowBite-Svelte
Optional Roles based access to data and components (AccessControl) [https://onury.io/accesscontrol]
Optional Admin role to allow for user role assignment
Optinal self-registration / manual (admin) registration
Feature release management

## Backend

Testing (vitest)
Logging (winston)
Performance Monitoring (sentry.io)
Email (SES)
