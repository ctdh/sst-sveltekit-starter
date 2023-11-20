# SST - Svelte Starter #

This starter includes the standard SST set up including the following stacks

- API (API with example routes)
- Storage (S3, Postgres and DynamoDB table)
- Tests


Before running dev or deploying set these environment parameters:
Set environment:
Create /.env.local or set in Seed or CI/CO
```
# port for the localstack ususally 5173 for svelte
PORT: 5173

# SelfRegistration: true: (default) allows users to register themselves
# false: users logging in must have their email already in the user db
SELF_REG: true

# When this email registers it is granted the role in the ADMIN_USER_ROLE
ADMIN_USER_EMAIL: me@mydomain.com

# The role associated with Administrators and asigned to ADMIN_USER_EMAIL user. ADMIN (default)
ADMIN_USER_ROLE: ADMIN
