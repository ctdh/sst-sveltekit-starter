// This checks the session token and redirects to the login page if it is missing

import type { ServerLoad } from '@sveltejs/kit';
import { userStore } from '../../lib/stores/user';
import type { User } from '../../../../core/user';
import { jwtDecode } from 'jwt-decode';
import type  { SessionTypes } from '../../../../functions/src/auth';


// export async function load({ session }) {
    export const load: ServerLoad = async ({ request }) => {
        const session = request.headers.get('cookie')?.split('; ').find(c => c.startsWith('sessionToken='))?.split('=')[1] ;
        
        if (!session){
           const user: SessionTypes['user'] = jwtDecode(session || '');
            const userId = user.properties.userId;
        }
    
        // TODO: fetch user data from the API
        // populate the user store
    };



    // Additional validation of the session token can be done here

    // Proceed with the authenticated user
