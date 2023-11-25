# Authentication & Authorisation

Some thoughts on authentication and authorisation

## Authentication

We are using the sst [Auth](https://docs.sst.dev/auth) library.  
There is also [/future/auth](https://github.com/sst/sst/blob/043401b355aea03f3f6c74d6204981e80946b3e4/packages/sst/src/node/future/auth/README.md#L4) which we have not yet impemented.

This includes a server side infrastructure applied to the api according to the handlers we create in [/auth.ts](./packages/functions/src/auth.ts).  In this starter we have created handlers for Google and Magiclink.

So authentication is validating that the user logging in has possession of the email address they claim.  The validatioon is confirmed by issueing signed token which is then stored in a secure, httpOnly cookie.  HttpOnly cookies are not available to read and write to in javascript in the client.

## Authorisation

We have implemented a simple role-based system that allows a user to adopt a number of roles (eg ADMIN, ROLE1 etc).  Roles are comma separeted listed in the roles atribute of the [user table](/packages/functions/migrations/first.mjs) at the moment.

Roles are defined in the [/type.ts](./packages/types/src/users.ts) file. Role ADMIN is used to manage access to the user table so, do not replace it.

Here are some .env options to help manage setting up roles.  Use the [/.env.local](/.env.local) file in local dev environments and use the [env varibale options in seed](https://seed.run/blog/stage-environment-variables.html) in deployed environemnts.

SELF_REG:  
***true***:  User logins will all be stored in user db table  
***false***: User loigns will not be stored in db table - role.ADMIN must create user with email.

ADMIN_USER_ROLE: ADMIN  
The user registering with ADMIN_USER_EMAIL will be automatically assigned this role.

ADMIN_USER_EMAIL: web@mydomain.com  
The user registering with this email will be assigend the ADMIN_USER_ROLE

## userStore

The [userStore](/packages/frontend/src/lib/stores/user.ts) handles the storing of the current [User](/packages/frontend/src/lib/user.ts.ts) information, including email and any roles.  The store is available throughout the frontend app and the client session.

## Applying Roles

Roles can be applied to any element in the frontend including +layout.svelte to [manage routes in SvelteKit](https://kit.svelte.dev/docs/advanced-routing).

We have implemented a simple +layout.svelte to handle user management and provide an example of implement user role-driven navigation.

/login []  
/dashboard [any]  
/admin [ADMIN]  
/role1 [ROLE_1]  
/role2 [ROLE_2]  
/role3 [ROLE_3]

You can define the roles required to access an element with restrictedTo(Roles[])

## Access

The handlers create endpoints on the api as follows

- https://[api_url]/auth/google/authorize
- https://[api_url]/auth/google/callback
- https://[api_url]/auth/link/authorize
- https://[api_url]/auth/link/callback

## Auth Flow

The flow is as follows:
![Auth Flow Process](./assets/Auth%20Flows-Auth%20Process%20Flow.drawio.png)

### Google

![Google Auth Flow Diagram](./assets/Auth%20Flows-Google.drawio.png)

From login form  
Client -> ../auth/google/authorize

Auth Handler -> to Google 

Google offers signin options  
auth result -> ../auth/google/callback

Google handler onSuccess  
sends session state -> Client  
the session state includes the user.id
and redirects to https://mydomain.com/

\- If SELF_REG = true  
+layout manages roles and validates session as required

\- If SELF_REG = false
+layout checks to see that user is already registered and what roles they have

### Linkadapter

![Link Auth Flow Diagram](./assets/Auth%20Flows-Magiclink.drawio.png)


From login form  
Client (email)-> ../auth/link/authorize

Auth Handler -> send SES email with link  

User clicks link with ../auth/link/callback?token=123zxy

Link handler onSuccess  
\- If SELF_REG = true  
\- sends  session state -> Client  
\- else  
\- sends temporary session state -> Client and redirects to https://mydomain.com/

\- If SELF_REG = true  
+layout manages roles and validates session as required

\- If SELF_REG = false
+layout checks to see that user is already registered and what roles they have