// takes session token fromm the query params and sets it in a cookie
// looks up the user and sets the roles in a cookie
// before it reaches the clien
// import type { RequestHandler } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import type  { SessionTypes } from '../../../../functions/src/auth';
// // import { User, type User as UserType } from '../../../../core/user';
/** @type {import('@sveltejs/kit').Handle} */
// import  { useSession, type SessionTypes } from 'sst/node/auth'; 
import type { Handle } from '@sveltejs/kit';
import { goto } from '$app/navigation';


// export async function GET handle ({ event, resolve }) {
//     console.log('callback server side', JSON.stringify(event));
//     // Get the URL object from the request
//     const url = new URL(event.url);
//     // let userRecord: UserType;
    
//     // Extract the session token from the query parameter
//     const sessionToken = url.searchParams.get('token');

//     if (!sessionToken) {
//         // Handle the case where the session token is missing
//         throw new Error('Session token is missing');
//     }

//     // decode the session token to get the userId
//     const user: SessionTypes['user'] = jwtDecode(sessionToken);
    
//     // check the sessionType
//     if (user.type == 'public') {
//         throw new Error('Public session is not valid');
//     }
    
//     // userRecord = await User.getByIdOrEmail(user.properties.userId)
//     // console.log('/callback user from db: ', userRecord);

//     // Create a new Response object
//     let response = new Response(JSON.stringify(null), {
//         status: 302,
//     });

//     // Append the Set-Cookie headers one by one
//     response.headers.append('Set-Cookie', `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax`);
//     // response.headers.append('Set-Cookie', `roles=${userRecord.roles}; Path=/; HttpOnly; Secure; SameSite=Lax`);
//     response.headers.append('Location', '/dashboard');

//     // Return the response
//     return response;
// };