<script lang='ts'>
    import Login from './login.svelte'
    import Waiting from './waiting.svelte'
    import { authState } from './store';
    
    

</script>
{#if !$authState.isSigningIn }
<Login />
{:else}
<Waiting />
{/if}