<script lang="ts">
	import Overlay from './Overlay.svelte';

	let { src, isOpen = $bindable() }: { src: string; isOpen: boolean } =
		$props();
</script>

{#if isOpen}
	<Overlay
		style="z-index: 11"
		onclick={() => {
			isOpen = false;
		}}
	>
		<img {src} alt="" />
	</Overlay>
{/if}

<style>
	img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
</style>
