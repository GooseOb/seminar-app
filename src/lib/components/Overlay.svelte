<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { blur } from 'svelte/transition';

	const {
		children,
		...props
	}: HTMLAttributes<HTMLDivElement> & { children?: any } = $props();
</script>

<div aria-hidden="true" transition:blur class="overlay" {...props}>
	{@render children?.()}
</div>

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
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
