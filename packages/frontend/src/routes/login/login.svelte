<script lang='ts'>
    import { writable } from 'svelte/store';
    import { env } from '$env/dynamic/public';
    import { onMount } from 'svelte';
    import { isSigningIn } from './store';

    const email = writable('');
    const error = writable('');
    const api_url = import.meta.env.VITE_APP_API_URL;

    let emailInput: HTMLInputElement;
    onMount(() => {
        emailInput.focus();
    });
    
    let googleAuthUrl = `${api_url}/auth/google/authorize?prompt=select_account`;
    let linkAuthUrl = `${api_url}/auth/link/authorize?email=`;
    
     
    async function handleLinkAuth(event: Event) {
        event.preventDefault();
        $isSigningIn = true;
        console.log($email, linkAuthUrl, linkAuthUrl + $email);
        await fetch(linkAuthUrl + $email,{});
    }
</script>

<div class="bg-surface-200 rounded-md shadow-md shadow-slate-500">
<!-- form posts to handlesubmit  -->
    <form on:submit={handleLinkAuth}>
        <div class="block max-w-md w-auto p-10 
        bg-primary-500-900-token border 
        border-secondary-200-700-token 
        rounded-lg shadow
        ">
        
            <h5 class=
            "mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
            >
                {import.meta.env.VITE_APP_NAME}
            </h5>
            <div class=
            "w-full font-normal text-gray-700 dark:text-gray-400"
            >
            <!-- label email bind -->
                <label for="email" class="block text-sm">Email</label>
                <input
                    bind:this={emailInput}
                    type="email"
                    name="email"
                    placeholder="Email"
                    autocomplete="username"
                    class=
                    "block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring"
                    bind:value={$email}
                    required
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]&#1232,&#125$"
                />
                <!-- &#123: { &#125: } -->
                
                <!-- <label for="email" class="mt-4 block text-sm">Email</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    autocomplete="current-password"
                    class=
                    "mt-2 block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none focus:ring"
                    bind:value={$password}
                /> -->

                <button 
                disabled = {$isSigningIn} 
                type="submit" 
                class="mt-4
                btn variant-filled-primary hover:variant-filled-secondary 
                flex justify-center w-full shadow-sm 
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                px-3 py-1.5 text-sm 
                font-semibold 
                leading-6"
                >
                Sign in</button>
                <!-- Horizontal spacer bar -->
                <div class="border-t mt-4 mb-4 border-gray-500"></div>
                <button 
                on:click={() => {
                    $isSigningIn = true;
                    window.location.href = googleAuthUrl
                }}
                disabled = {$isSigningIn}
                type="button" 
                class="
                mt-4
                btn variant-filled-primary hover:variant-filled-secondary 
                flex justify-center w-full shadow-sm 
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                px-3 py-1.5 text-sm 
                font-semibold 
                leading-6"
                >Sign in with Google</button>
            </div>
        </div>
    </form>

</div>