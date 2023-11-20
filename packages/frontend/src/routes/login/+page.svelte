<script lang='ts'>
    import Login from './login.svelte'
    import Waiting from './waiting.svelte'
    import { isSigningIn } from './store';
    
    

</script>
{#if !$isSigningIn }
<Login />
{:else}
<Waiting />
{/if}