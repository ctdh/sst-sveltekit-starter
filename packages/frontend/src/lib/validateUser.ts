// src/lib/session.ts
import { userStore,  } from '../lib/stores/user';
import { errorStore, addError } from '../lib/stores/error';
import { goto } from '$app/navigation';
import type { User } from '$shared_types/types/src/users';
import { jwtDecode } from 'jwt-decode';
// import { useSession } from "sst/node/auth";


// Alternative auth
// decode the JWT token and match the userId with the user in the database
// check the user type in the JWT is 'user' and not 'public'
// if the user type is 'public' then logout
// if the user type is 'user' and getUserById returns an email (and roles) 
// then set the userStore else logout

export async function altAuth(token:string | null){
    if (!token) throw new Error('No session token available');
    const decodedToken = jwtDecode(token);
    const keyValueArray = Object.entries(decodedToken);
    const userType = keyValueArray[0][1];
    const userId = keyValueArray[1][1];
    console.log('altAuth userId', userId);
    console.log('altAuth userType', userType);
    addError('1. altAuth userInfo userId:' + userId.userId);
    addError('2. altAuth userInfo userType:' + userType);
    if (userType === 'public') {
        logoutSession();
        return false;
    }
    if (userType === 'user') {
        const userInfo =  getUserInfo(token);
        if (userInfo) {
            addError('3. altAuth userInfo' + JSON.stringify(userInfo));
            userStore.set(await userInfo);
            return true;
        } else {
            addError('4. altAuth userInfo' + JSON.stringify(userInfo));
            logoutSession();
            return false;
        }
    }
    return false;
}

// This is the Auth flow...
// Initialize auth flow (claim: email): client -> /auth [authHandler]
// Redirect to auth provider /auth -> Google etc or /auth/link
// Auth success: /Google -> /auth or email Link -> /auth/link
// Session token: /auth -> client
// Check credentials: (sessionToken): client -> /session
// User credentials: /session -> client
// Since anyone can 'login' with any email

// Session checks if the email is already registered
// sets userInfo in the session store and checks user roles
// if, no roles sessionToken expired then logout

const API_URL = import.meta.env.VITE_APP_API_URL;

// Authenticate callback token
export async function authSessionToken(token: string | null): Promise<Boolean> {
    // if (typeof window !== 'undefined') {
    //     console.log('authSessionToken - window not defined', token);
    // }
    addError('4. start src/lib/session.authSessionToken')
    removeTokenFromUrl();
    addError('5. rauthSessionToken emoveTokenFromUrl')
    try{
        if (!token) throw new Error('No session token available');
        addError('6. authSessionToken calling getUserInfo')
        const userInfoResponse = await getUserInfo(token)
        addError('12. authSessionToken calling getUserInfo')
        // userStore.set(userInfoResponse);
    //     // return false;
    // throw new Error('Testing error store');
        addError('13. authSessionToken return: true')
        return true;
    } catch (err) {
        addError('E1. authSessionToken return: false')
        err = err instanceof Error ? err.message : 'An unknown error occurred'
        console.log('authSessionToken error', err)
        // errorStore.set(err);        
        logoutSession();
        return false;
    }
}

export function getSessionCookie(): string | null {
    addError('2. start getSessionCookie')
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'session') return value;
    }
    return null;
}

// takes the current session token and validates it against the backend
// logs out if the token is invalid

// this will not work on server side rendering

// export function validateSession(): boolean {
//     // TODO: validate session token against backend

//     try {
//         const sessionType = useSession().type;
//         return sessionType != "public" 
//     } catch {
//         logoutSession();
//         return false;
//     }
// }


// Clear session token from storage and redirect to login
export function logoutSession(): void {
    localStorage.removeItem('sessionToken');
    document.cookie = 'sessionToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    userStore.set(null);

    goto ('/login');
}

// Set session token in storage
async function setSessionToken(sessionToken: string): Promise<Boolean> {
    try {
        localStorage.setItem('sessionToken', sessionToken);
        document.cookie = `sessionToken=${sessionToken}; path=/;`;
        
    } catch {
        logoutSession();
        return false;
    }
    return true
}

// gets the user info from the backend and sets in userStore
async function getUserInfo(token:string | null): Promise<User> {
    addError('7. start getUserInfo')
    token = token || localStorage.getItem('sessionToken');
    if (!token) throw new Error('No session token available');
    try {
        addError('8. calling fetch api/session')
        const response = await fetch(`${API_URL}/session`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` }
        });
        addError(`9. getUserInfo response.ok:  ${response.ok}`)
        // TODO: Fix this
        // session response from server is ession_response: '{"userInfo":{"id":"b890b605-5211-4cad-a3a0-f88c4e43c7c8","email":"web@pathwayanalytics.com","picture":null,"first_name":null,"last_name":null},"type":"user"}'
        // response.json() is {"userId":"b890b605-5211-4cad-a3a0-f88c4e43c7c8","type":"user"}
        
        
        const data: any = await response.json();
        addError(`9.1. getUserInfo data:  ${JSON.stringify(data)}`)
        // const userInfo:User =  data.userInfo;
        addError(`10. getUserInfo userInfo.email: ${data.userInfo.email}`)
        if (!response.ok) throw new Error('Invalid session token');        
        data.userInfo && userStore.set(await data.userInfo);
        addError(`11.  getUserInfo set userStore: ${userStore}`)
        return data.userInfo
    } catch (err) {
        addError(`E2. getUserInfo err: ${err}`)
        logoutSession();
        throw err;
    }        
}

// Cleanup session token from URL
function removeTokenFromUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.pushState({}, '', url);
}
// decode JWT token
export function decodeToken(token: string): any {
    
    const decodedToken = jwtDecode(token);
    const keyValueArray = Object.entries(decodedToken);
    return keyValueArray;
}

export function getUserIdfromJWT() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const decodedToken = jwtDecode(token);
    const keyValueArray = Object.entries(decodedToken);
    const userId = keyValueArray[1][1];
    return userId;
}
