<script lang="ts">
import { LightSwitch } from '@skeletonlabs/skeleton';
    
</script>
<LightSwitch />
    

<h1>Welcome to the SST - SvelteKit Start</h1>
<p>
    The kit is a template for building fast, scalable Svelte apps with zero configuration.
</p>
<p>
    It includes:
</p>
    <ul>
        <li>
            SST - Skeleton Svelte Template
            It is setup to offer a public route and an authenticated route
        </li>
        <li>
            0Auth - Google, Magiclink authentication with JWT
            Session tokens are stored in a secure cookie and managed by a servside endpoint at /routes/callback
            Authentication validation based on routes is managed by +layout.server.ts pages prior to rendering the page
            Authentication validation based on pages is managed by +page.server.ts pages prior to rendering the page
            User data for presentational purposes is stored in localStorage
        </li>
    </ul>

<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
  
