<script lang="ts">
    // import { writable } from 'svelte/store';
    import type { User  } from '$shared_types/types/index';
    import  { Role } from '$shared_types/types/index';
    import { page } from '$app/stores';
    import { onMount, onDestroy } from 'svelte';
    import { restrictedTo } from '../../../lib/restrictedTo';
    // import { goto } from '$app/navigation';
    import { userStore } from '../../../lib/stores/user';
    import { errorStore, addError } from '../../../lib/stores/error';
    import  { 
        altAuth, 
        authSessionToken, 
        logoutSession, 
        getSessionCookie, 
        decodeToken 
    } from '../../../lib/validateUser';

    // const user = writable<Users | null>(null);
    let isLoading = false;

    let user: string | null
    let email: string | null | undefined
    let id: string | null | undefined
    let t: string | null
    let e: any
    let JWT: string | null | undefined
    let roles: Role[] = [Role.ADMIN];

    onMount(async () => {
        addError('1. Start of onMount');
        isLoading = true;
        restrictedTo(roles);
        // if (typeof window !== 'undefined') {
            const token = $page.url.searchParams.get('token') ||
                      window.localStorage.getItem('session') || 
                      getSessionCookie() ;
        addError('3. onMount token: ' + token);
        // logout if token is not valid
        t = token
        await altAuth(token);
        // await authSessionToken(token) // && logoutSession()
        addError('14. onMount authSessionToken returned'); 
        // }        
        isLoading = false;
        JWT = JSON.stringify(decodeToken(token ?? ''))
    })

    $:  {
            user = JSON.stringify(userStore, null, 2);
            id = $userStore?.id;
            email = $userStore?.email;
            e =  JSON.stringify(errorStore, null, 2);
    }


    function logout() {
    //     logoutSession();
    }




    // const API_URL = import.meta.env.VITE_APP_API_URL;

    // const user = writable<Users | null>(null);
    // let isLoading = false;
    // let error = '';
    // let debugResponse: any = null;

    // onMount(async () => {
    //     isLoading = true;
    //     try {
    //         const token = await getSessionToken();
    //         const userInfoResponse = await getUserInfo(token);
    //         const validatedUser = validateUserInfo(userInfoResponse);
    //         user.set(validatedUser);
    //     } catch (err) {
    //         error = err instanceof Error ? err.message : 'An unknown error occurred';
    //         console.error('Error during initialization:', error);
    //         logout();
    //     } finally {
    //         removeTokenFromUrl();
    //         isLoading = false;
    //     }
    // });

    // async function getSessionToken(): Promise<string> {
    //     const token = $page.url.searchParams.get('token') ||
    //                   window.localStorage.getItem('session') ||
    //                   getCookie('session');
    //     if (!token) throw new Error('No session token available');
    //     setToken(token);
    //     return token;
    // }

    // function setToken(token: string) {
    //     window.localStorage.setItem('session', token);
    //     document.cookie = `session=${token}; path=/pwa/; secure; samesite=strict;`;
    // }

    // function getCookie(cookieName: string): string | null {
    //     const cookies = document.cookie.split('; ');
    //     for (let cookie of cookies) {
    //         const [name, value] = cookie.split('=');
    //         if (name === cookieName) return value;
    //     }
    //     return null;
    // }

    // async function getUserInfo(token: string): Promise<{ user?: Users; type?: string }> {
    //     const response = await fetch(`${API_URL}/session`, {
    //         method: 'GET',
    //         headers: { Authorization: `Bearer ${token}` }
    //     });

    //     if (!response.ok) {
    //         throw new Error(`Failed to fetch user info: ${response.statusText}`);
    //     }
        
    //     const data = await response.json();
    //     debugResponse = data; // Store the response data in the debug variable
    //     return data;    
    // }

    // function validateUserInfo(response: { user?: Users; type?: string }): Users {
    //     if (!response || !response.user || !response.user.id) {
    //         throw new Error(`Invalid user data received ${JSON.stringify(response)}`);
    //     }
    //     return response.user;
    // }

    // function logout() {
    //     window.localStorage.removeItem('session');
    //     document.cookie = 'session=; path=/pwa; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    //     goto('/login');
    // }


</script>

    {isLoading}
    <pre>
        error: {e}
        token: {t}
        user: {user}
        id: {id}
        email: {email}
        JWT: {JWT}
    </pre>
    <ul>
    {#each [...$errorStore].reverse() as error (error)}
        <li>{error}</li>
    {/each}
    </ul>
    <pre>
        page: {JSON.stringify($page, null, 2)}    
    </pre>
<nav class="container flex items-center gap-4 py-4 mx-auto">
	<div>
		<a href="/" class:active={$page.url.pathname === '/'}>Home</a>
	</div>
        <button
            class="flex px-4 py-2 font-bold text-white bg-gray-900 rounded hover:bg-gray-700 w-fit"
            on:click={logout}
        >Logout</button>
	<div>
        ...
		<!-- {#if !session} -->
			<!-- {#if !isLoading} -->
				<a href="/auth" class:active={$page.url.pathname === '/auth'}>Login</a>
			<!-- {/if} -->
		<!-- {:else} -->
			<button
				class="flex px-4 py-2 font-bold text-white bg-gray-900 rounded hover:bg-gray-700 w-fit"
				on:click={() => {
					window.localStorage.removeItem('session');
					window.location.href = '/auth';
				}}
			>
				Logout
			</button>
		<!-- {/if} -->
	</div>
</nav>

<main class="container py-8 mx-auto">
	<slot />
</main>

<style>
	nav a {
		@apply text-blue-700 text-lg;
	}

	nav a.active {
		@apply font-bold;
	}
</style>