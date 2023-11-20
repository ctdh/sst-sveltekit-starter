# Authentication & Authorisation

Some thoughts on authentication and authorisation

## Authentication

We are using the sst [Auth](https://docs.sst.dev/auth) library.  
There is also [/future/auth](https://github.com/sst/sst/blob/043401b355aea03f3f6c74d6204981e80946b3e4/packages/sst/src/node/future/auth/README.md#L4) which we have not yet impemented.

This includes a server side infrastructure applied to the api according to the handlers we create in [/auth.ts](./packages/functions/src/auth.ts).  In this starter we have created handlers for Google and Magiclink.

So authentication is validating the user logging in is in possession of the email address they claim and that they are a userType 'user' rather than userType 'public'

## Authorisation

We have implemented a simple role-based system that allows a user to adopt a number of roles (eg ADMIN, ROLE1 etc).  Roles are comma separeted listed in the roles atribute of the [user table](/packages/functions/migrations/first.mjs).

Roles are defined in the [/type.ts](/packages/frontend/src/lib/types.ts) file. Role ADMIN is used to manage access to the user table so, do not replace it.

Here are some .env options to help manage setting up roles.  Use the [/.env.local](/.env.local) file in local dev environments and use the [env varibale options in seed](https://seed.run/blog/stage-environment-variables.html) in deployed environemnts.

SELF_REG:  
***true***:  User logins will all be stored in user db table  
***false***: User loigns will not be stored in db table - role.ADMIN must create user with email.

FIRST_USER_ROLE: ADMIN  
When the first user successfully logs in they are assigned with the **<span style="color:red;">ADMIN role!!</span>**.  Leave empty to avoide this.

FIRST_USER_EMAIL: \web@pathwayanalytics.com  
Sets a user with the given email and gives them the role ADMIN

## userStore

The [userStore](/packages/frontend/src/lib/stores/user.ts) handles the storing of the current [User](/packages/frontend/src/lib/types.ts) information, including email and any roles.  The store is available throughout the frontend app and the client session.

## Applying Roles

Roles can be applied to any element in the frontend including +layout.svelte to [manage routes in SvelteKit](https://kit.svelte.dev/docs/advanced-routing).

We have implemented a simple +layout.svelte to handle user management and provide an example of implement user role-driven navigation.

/login [] 
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

### Google

![Auth Flow Diagram](https://sst.dev/assets/examples/api-sst-auth-google/auth-flow.png)

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