<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import NoZoom from './NoZoom.svelte';
	import Overlay from './Overlay.svelte';
	import PDFCore from './PDFCore.svelte';

	let {
		isOpen = $bindable(),
		children,
		...props
	}: Omit<ComponentProps<typeof PDFCore>, 'scale'> & {
		isOpen: boolean;
		children?: any;
	} = $props();

	let scale = $state(1.5);
	let lastDist = 0;

	const ontouchstart = (e: TouchEvent) => {
		if (e.touches.length === 2) {
			lastDist = getDistance(e.touches[0], e.touches[1]);
		}
	};
	const ontouchend = (e: TouchEvent) => {
		if (e.touches.length < 2) {
			lastDist = 0;
		}
	};

	const ontouchmove = (e: TouchEvent) => {
		if (e.touches.length === 2) {
			e.preventDefault();
			e.stopPropagation();

			const newDist = getDistance(e.touches[0], e.touches[1]);
			const delta = newDist - lastDist;

			if (Math.abs(delta) > 2) {
				scale += delta > 0 ? 0.02 : -0.02;
				lastDist = newDist;
			}
		}
	};

	const getDistance = (touch1: Touch, touch2: Touch) => {
		const dx = touch1.clientX - touch2.clientX;
		const dy = touch1.clientY - touch2.clientY;
		return Math.sqrt(dx * dx + dy * dy);
	};
</script>

{#if isOpen}
	<NoZoom />
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
				scale += e.deltaY < 0 ? 0.01 : -0.01;
			}
		}}
		{ontouchstart}
		{ontouchmove}
		{ontouchend}
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

			<PDFCore {...props} {scale} />
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
