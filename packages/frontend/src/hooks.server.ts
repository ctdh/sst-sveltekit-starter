// hooks for server-side rendering
// https://kit.svelte.dev/docs#hooks
// hooks redirects to the login page if the session token is missing

/** @type {import('@sveltejs/kit').Handle} */
// import type { RequestHandler } from '@sveltejs/kit';
import  { useSession, type SessionTypes } from 'sst/node/auth'; 
import type { Handle } from '@sveltejs/kit';

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

  const unProtectedRoutes = [
    '/login', 
    '/public',
    '/callback',
]; 
export async function handle({ event, resolve }) {
  // const session: SessionTypes = useSession();
  // const urlIsProtected = !unProtectedRoutes.includes(event.url.pathname);
  // if (!session) {
  //   // No session found, redirect to login
  //     return Response.redirect('/login');
  // } else {
  //   // Validate the session
  //   if (urlIsProtected && session.public) {
  //     // Invalid session, redirect to login
  //     return Response.redirect('/login');
  //   }
  //   // Session is valid, proceed with the request
    return resolve(event);
  // }

};

