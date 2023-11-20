<script>
    import { AppShell, AppBar } from '@skeletonlabs/skeleton';    
    import NavBar from '../../components/NavBar.svelte';
</script>

<AppShell regionPage="relative" slotPageHeader="sticky top-0 z-10">
	<svelte:fragment slot="header">
        <NavBar />
        <!-- <AppBar>
        </AppBar> -->
    </svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
        <div id="sidebar-left" class="hidden lg:block px-10">
        
        </div>
    </svelte:fragment>
	<svelte:fragment slot="sidebarRight">
        <div id="sidebar-right" class="hidden lg:block px-10">
            
        </div>
    </svelte:fragment>
	<!-- (pageHeader) -->
	<!-- Router Slot -->
	<slot />
	<!-- ---- / ---- -->
	<!-- (pageFooter) -->
	<svelte:fragment slot="footer">
        Footer
    </svelte:fragment>
</AppShell>