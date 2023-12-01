// we are specifically using an endpoint with .server.ts to handle the session token 
// and set the cookie before any page is rendered
// sessionParameters are sent by /packages/functions/src/auth.ts

// takes session token fromm the query params and sets it in a cookie
// looks up the user and sets the roles in a cookie
// redirects to the home page

import type { SessionTypes } from 'sst/node/auth';
import { goto } from '$app/navigation';
import { timeStamp } from 'console';
import { Config } from 'sst/node/config';

export async function GET(event): Promise<Response> {
    const sessionToken: string = event.url.searchParams.get('token') || '';
    // set the session token in a cookie
    const roles: string ='xx'
    console.log('---*** callback.server.ts Stage: ', Config.STAGE);
    // const sessionTokenCookie = `sessionToken=${sessionToken}; Path=/; HttpOnly; SameSite=None; ` + (Config.STAGE === 'prod' ? 'Secure;' : '');
    const roleCookie = `roles=${roles}; Path=/; HttpOnly; SameSite=None; Domain= localhost;` // + (Config.STAGE === 'prod' ? 'Secure;' : '');
    // console.log('---*** callback.server.ts sessionTokenCookie: ', sessionTokenCookie);
    const headers = new Headers();
    // headers.append('Set-Cookie', sessionTokenCookie)
    headers.append('Set-Cookie', roleCookie)
    console.log('---*** callback.server.ts headers: ', headers.entries());
    return new Response(null, {
        status: 302,
        headers: {
            ...headers,
        'Location': '/'
        }
    });
}
