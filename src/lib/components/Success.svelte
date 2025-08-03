<script lang="ts">
	import { fade } from 'svelte/transition';

	const {
		value,
		children
	}: {
		value: any;
		children: () => any;
	} = $props();

	let isVisible = $state(false);

	$effect(() => {
		if (value) {
			isVisible = true;
			setTimeout(() => {
				isVisible = false;
			}, 2000);
		}
	});
</script>

{#if isVisible}
	<div transition:fade>
		{@render children()}
	</div>
{/if}

<style>
	div {
		background-color: var(--bg3-color);
		font-weight: bold;
		padding: 0.5rem;
		border-radius: 0.5rem;
		text-align: center;
		color: var(--success-color);
	}
</style>
