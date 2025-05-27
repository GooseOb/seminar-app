<script lang="ts">
	import Overlay from './Overlay.svelte';
	import { throttle } from '$lib/debounce';
	import PDFCore from './PDFCore.svelte';

	let {
		src,
		isOpen = $bindable(),
		children
	}: {
		src: string;
		isOpen: boolean;
		children?: any;
	} = $props();

	let scale = $state(1.5);

	let scaleAcc = $state(1.5);
	const updateScale = throttle(() => {
		scale = scaleAcc;
	}, 100);
</script>

{#if isOpen}
	<Overlay
		style="z-index: 11"
		onclick={({ target, currentTarget }) => {
			if (target === currentTarget) {
				isOpen = false;
			}
		}}
		onwheel={(e) => {
			if (e.ctrlKey) {
				e.preventDefault();
				e.stopPropagation();
				scaleAcc += e.deltaY < 0 ? 0.01 : -0.01;
				updateScale();
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

			<PDFCore {src} {scale} />
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
</style>
