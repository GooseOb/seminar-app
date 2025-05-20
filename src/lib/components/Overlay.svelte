<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { blur } from 'svelte/transition';
	const { ...props }: HTMLButtonAttributes = $props();
</script>

<button aria-hidden="true" transition:blur class="overlay" {...props}></button>

<style>
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(1px);
		z-index: 5;
	}
</style>
