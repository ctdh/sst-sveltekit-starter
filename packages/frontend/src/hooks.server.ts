// hooks for server-side rendering
// https://kit.svelte.dev/docs#hooks
// hooks redirects to the login page if the session token is missing

/** @type {import('@sveltejs/kit').Handle} */
import { jwtDecode } from 'jwt-decode';
import  { useSession, type SessionTypes } from 'sst/node/auth'; 
import type { Handle } from '@sveltejs/kit';
import { goto } from '$app/navigation';

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
  // console.log('event: ', JSON.stringify(event)); 
  // console.log('cookies: : ', JSON.stringify(event.cookies));
  // console.log('url: : ', event.url.origin);


  const cookies = event.cookies;
  console.log('hooks.server.ts cookies: ', JSON.stringify(cookies));
  const urlIsProtected = !unProtectedRoutes.includes(event.url.pathname);
  console.log('hooks.server.ts unProtectedRoutes: ', JSON.stringify(unProtectedRoutes));
  console.log('hooks.server.ts url: ', event.url.pathname);
  console.log('hooks.server.ts urlIsProtected: ', urlIsProtected);
  // if (!cookies) {
  // // No session found, redirect to login
  //   goto('login');
  //   return Response.redirect(event.url.origin+'/login');
  // } else {
  // // Validate the session
  //   if (urlIsProtected && cookies) {
  //     // Invalid session, redirect to login
  //     return Response.redirect(event.url.origin+'/login');
  //   }
  //   // Session is valid, proceed with the request
  //   return resolve(event);
  // }

  return resolve(event);
};

