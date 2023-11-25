<script lang='ts'>
    import { Spinner } from 'flowbite-svelte';
    import { authState, email } from './store';
    import { onMount, onDestroy } from 'svelte';
    import { goto } from '$app/navigation';

    let message = '';
    let intervalId:any = null;

    onMount(() => {
        intervalId = setInterval(() => {
            if ($authState.isSigningIn && $authState.expiresAt && $email) {
            const remainingTime = $authState.expiresAt - Date.now();
            const remainingMinutes = Math.floor(remainingTime / 1000 / 60);
            const remainingSeconds = Math.floor((remainingTime / 1000) % 60);
            if (remainingTime <= 0) {
                    goto('/login');
                } else {
                message = `waiting... check your ${$email} email for a link to login. 
                <br /><br />link expires in ${remainingMinutes} minutes and ${remainingSeconds} seconds`;
                }
            }  else {
                message = 'waiting...';
            }
        }, 1000);
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });

</script>
<div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-size: 1.5em;">
    <Spinner />
    <p class="m-4">{@html message}</p>

</div>