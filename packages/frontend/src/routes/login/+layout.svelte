<script>
    import { AppShell } from '@skeletonlabs/skeleton'; 
	   
</script>
<body 
class="variant-filled-primary">
	<AppShell>
		<!-- (pageHeader) -->
		<!-- Router Slot -->
		<div class="flex justify-center items-center min-h-screen">
			<div class="inline-flex flex-col">
				<slot />
			</div>
		</div>
		<!-- ---- / ---- -->
		<!-- (pageFooter) -->
		<svelte:fragment slot="footer">
			Footer
		</svelte:fragment>
	</AppShell>
</body>

