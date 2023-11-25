// takes session token fromm the query params and sets it in a cookie
// looks up the user and sets the roles in a cookie
// before it reaches the clien
import type { RequestHandler } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';
import type  { SessionTypes } from '../../../../functions/src/auth';
import { env } from '$env/dynamic/public';
import type { User } from '../../../../core/user';

export const GET: RequestHandler = async ({ request }) => {
    // Get the URL object from the request
    const url = new URL(request.url);
    let userRecord: User;
    
    // Extract the session token from the query parameter
    const sessionToken = url.searchParams.get('token');

    if (!sessionToken) {
        // Handle the case where the session token is missing
        throw new Error('Session token is missing');
    }

    // decode the session token to get the userId
    const user: SessionTypes['user'] = jwtDecode(sessionToken);
    const userId = user.properties.userId;

    // check the sessionType
    if (user.type == 'public') {
        throw new Error('Public session is not valid');
    }

    let roles;
    try {
        const response = await fetch(`${env.PUBLIC_API_URL}/users/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${sessionToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Server error');
        }

        const userDataString: string = await response.json();
        userRecord = JSON.parse(userDataString);
        // console.log(typeof userRecord); // Should be 'object'
        // console.log('User Data:', userDataString); // Full object
        // console.log('Roles:', userRecord.roles); // Should be 'ADMIN'
        // console.log('userRecord before set:', userRecord);

    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to fetch roles');
    }

    // Use the session token
    // ...

    // Create a new Response object
    let response = new Response(JSON.stringify(null), {
        status: 302,
    });

    // Append the Set-Cookie headers one by one
    response.headers.append('Set-Cookie', `sessionToken=${sessionToken}; Path=/; HttpOnly; Secure; SameSite=Lax`);
    response.headers.append('Set-Cookie', `roles=${userRecord.roles}; Path=/; HttpOnly; Secure; SameSite=Lax`);
    response.headers.append('Location', '/dashboard');

    // Return the response
    return response;
};