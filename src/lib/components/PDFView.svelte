<script lang="ts">
	import Overlay from './Overlay.svelte';
	import { loadPDF } from '$lib/pdf';

	let {
		src,
		isOpen = $bindable(),
		children
	}: {
		src: string;
		isOpen: boolean;
		children?: any;
	} = $props();

	let loading = $state(true);

	let container = $state<HTMLDivElement | null>(null);

	$effect(() => {
		if (container) {
			loading = true;
			loadPDF(container, src).then(() => {
				loading = false;
			});
		}
	});
</script>

{#if isOpen}
	<Overlay
		style="z-index: 11"
		onclick={({ target, currentTarget }) => {
			if (target === currentTarget) {
				isOpen = false;
			}
		}}
	>
		<div class="pdf-modal">
			<div class="top-bar">
				{@render children?.()}
				<button
					class="close-btn btn2"
					onclick={() => {
						isOpen = false;
					}}
					aria-label="Close">✕</button
				>
			</div>

			{#if loading}
				<div class="loader">Loading PDF…</div>
			{/if}
			<div class="pdf-container" bind:this={container}></div>
		</div>
	</Overlay>
{/if}

<style>
	.pdf-modal {
		position: relative;
		width: 80vw;
		max-width: 900px;
		height: 95%;
		background: var(--bg-color);
		border-radius: 0.5rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		@media (max-width: 600px) {
			width: 100%;
			height: 100%;
			border-radius: 0;
		}
	}

	.top-bar {
		background: var(--bg2-color);
		padding: 0.5rem 1rem;
		border-bottom: 1px solid var(--bg3-color);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.close-btn {
		font-size: 1.25em;
		font-weight: bold;
		cursor: pointer;
		padding: 0.1rem 0.5rem;
		margin-left: auto;
		height: fit-content;
		margin-bottom: auto;
	}

	.pdf-container {
		flex: 1;
		overflow-y: auto;
		background: var(--bg4-color);
		:global(canvas) {
			max-width: 100%;
			height: auto;
		}
		:global(span) {
			position: absolute;
			color: transparent;
			white-space: pre;
			transform-origin: 0 0;
		}
	}

	.loader {
		padding: 2rem;
		text-align: center;
		font-weight: bold;
		font-size: 1.2rem;
	}
</style>
