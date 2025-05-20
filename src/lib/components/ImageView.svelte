<script lang="ts">
	import Overlay from './Overlay.svelte';

	let { src, isOpen = $bindable() }: { src: string; isOpen: boolean } =
		$props();
</script>

{#if isOpen}
	<Overlay
		onclick={() => {
			isOpen = false;
		}}
	>
		<img {src} alt="" class="image" />
	</Overlay>
{/if}

<style>
	.image {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
	}
</style>
