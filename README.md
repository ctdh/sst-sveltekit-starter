# SST - Svelte Starter #

This starter includes the standard SST set up including the following stacks

- API (API with example routes)
- Storage (S3, Postgres and DynamoDB table)
- Tests


Before running dev or deploying set these environment parameters:

Set any client id secrets you need:
```
pnpm sst secrets set GOOGLE_CLIENT_ID <YOUR GOOGLE_CLIENT_ID>
pnpm sst secrets set GITHUB_CLIENT_ID <YOUR GITHUB_CLIENT_ID>
pnpm sst secrets set GITHUB_CLIENT_SECRET <YOUR GITHUB_CLIENT_SECRET>

```
Set environment:
Create /.env.local or set in Seed or CI/CO

```bash
// .env.local
# port for the localstack ususally 5173 for svelte
PORT: 5173

# Application name
APP_NAME: My Appname in /.env.local

# SelfRegistration: true allows users to register themselves
# false users logging in must have their email already in the user db
SELF_REG: true

# Role assigned to ADMIN_USER_EMAIL
ADMIN_USER_ROLE: ADMIN

# User registering with this email will be assigned ADMIN_USER_ROLE
ADMIN_USER_EMAIL: web@mydomain.com
```

After deploying locally
```
pnpm run dev
cd ./packages/frontend
pnpm run dev
```

goto the console and deply the first.mjs migration
```
pnpm run console
```

AWS SES requires you to verify your domain and email before you can use it in the sandbox, be sure to do this for the region you deploy to.

[Auth flows](./_auth.md)

[TODO:](./TODO.md)
