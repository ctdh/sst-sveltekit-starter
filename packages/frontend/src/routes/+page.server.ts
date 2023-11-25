// This checks the session token and redirects to the login page if it is missing
// unlike a +layout.server.ts file, this page will only act on this route and not
// any child routes
import type { ServerLoad } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export const load: ServerLoad = async ({ request }) => {
    const sessionToken = request.headers.get('cookie')?.split('; ').find(c => c.startsWith('sessionToken='))?.split('=')[1];

    if (!sessionToken) {
        throw redirect(302, '/login');
    }
}
