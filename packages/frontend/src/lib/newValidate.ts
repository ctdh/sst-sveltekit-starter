import { userStore } from './stores/user';
import { errorStore } from './stores/error';
import { goto } from '$app/navigation';
import type { Session, User, Role } from '$shared_types/types/index';
import { addError } from './stores/error';
import { useSession } from 'sst/node/auth';
import { get } from 'svelte/store';

// validate a client element is restricted to a user with allowed roles
export async function validateUser(allowedRoles:Role[]): Promise<Boolean> {
    const session: Session = useSession()
    if (!session) {
        addError('validateUser: user not authenticated ');
    }
    const userType: 'public' | 'user' = session.type;
    const userId: string = session.properties.userId;
    // get current sessionToken from localStorage
    // user must be successfully authenticated to have a sessionToken stored in localStorage
    const token = localStorage.getItem('sessionToken');
    if (!token) return false;

       
    // using the values in the local storage for csvUserRoles 
    const csvUserRoles:string = get(userStore)?.roles ?? '';

    // useing getUserById from db
    // const csvUserRoles  = (await getUserById(token, userId)).roles ?? '';
    const matchingRoles = getMatchingRoles(csvUserRoles, allowedRoles);
    if (
        userType === 'user'
        && userId === get(userStore)?.id
        && matchingRoles.length > 0) {
        return true;
    } else {
        addError('validateUser: user not authenticated for this element');
        return false;
    }
}

// Clear session token from storage and redirect to login
export function logoutSession(): void {
    localStorage.removeItem('sessionToken');
    document.cookie = 'sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    userStore.set(null);
    goto ('/login');
}

// Set session token in storage and userStore
//  
export function setSessionToken(user: User, sessionToken: string): Boolean {
    let userInfoDbSuccess: Boolean = false;
    // decode the JWT to get the userId
    // check the userId in the JWT with the user db
    // if .env.SELF_REG then create/update userInfo in db
    // else if user.email is .env.FIRST_USER_EMAIL 
    // then create userInfo in db with .env.FIRST_USER_ROLE
    // else update userInfo only
    if (import.meta.env.SELF_REG !== 'true') {
        // do not allow self registration
        // create/update userInfo in db

        if (user.email === import.meta.env.FIRST_USER_EMAIL) {
            // create/update userInfo in db with .env.FIRST_USER_ROLE

        } else {
            // create userInfo in db with '' role
        } 
    } else {
        // allow self registration
        // create/update userInfo in db
    }
    // if fetch to post user update succeeds then set sessionToken in localStorage
    
    try {
        localStorage.setItem('sessionToken', sessionToken);
        document.cookie = `sessionToken=${sessionToken}; path=/;`;
        return true;
    } catch {
        logoutSession();
        return false;
    }
}

// match a csv list of roles with an array of allowed roles
function getMatchingRoles(csvUserRoles: string, allowedRoles: string[]): string[] {
    // Split the CSV string into an array and trim spaces
    const userRoles = csvUserRoles.split(',').map(role => role.trim());
    // Filter the roles that are present in the allowedRoles array
    const matchingRoles = userRoles.filter(role => allowedRoles.includes(role));
    return matchingRoles;
}

// update UserById from backend using token as an authorzation header
async function updateUserById(token:string | null, user: User): Promise<User> {
    const response = await fetch(`/api/users/${user.id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('sessionToken')}`
        }
    });
    return await response.json();
}

