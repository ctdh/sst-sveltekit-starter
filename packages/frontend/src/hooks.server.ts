// hooks for server-side rendering
// https://kit.svelte.dev/docs#hooks
// hooks redirects to the login page if the session token is missing

import type { RequestHandler } from '@sveltejs/kit';

interface UserLocals {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      picture: string;
      roles: string;
    };
  }

  // Define a new interface that extends the Handle interface and includes a locals property
interface ExtendedServerRequest extends RequestHandler {
    locals: UserLocals;
  }
const unProtectedRoutes = [
    '/login', 
    '/public',
    '/callback',
];

// export async function handle({ event, resolve}){
//     const urlIsProtected = !unProtectedRoutes.includes(event.url.pathname);
//     console.log('urlIsProtected: ',event.url.pathname + ' ' + urlIsProtected);
//     const cookies = event.cookies.getAll();
//     console.log('./hooks.ts handle.cookies: ', JSON.stringify(cookies));
//     return resolve(event);
// }