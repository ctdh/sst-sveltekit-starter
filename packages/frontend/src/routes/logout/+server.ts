// src/routes/logout/+server.ts
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ request }) => {
    // Invalidate the session token on the server side
    // (e.g., remove it from the database or session store)


    // Clear the session cookie
    let response = new Response(null, {
        status: 302,
    });

    // Append the Set-Cookie headers one by one
    response.headers.append('Set-Cookie', `sessionToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`);
    response.headers.append('Set-Cookie', `roles=''; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax`);
    response.headers.append('Location', '/login');

    // Return the response
    return response;
};
