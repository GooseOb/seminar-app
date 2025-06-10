<script lang="ts">
	import type { DragEventHandler } from 'svelte/elements';
	import { debounce } from '$lib/utils/debounce';
	import * as m from '$lib/paraglide/messages';

	const {
		ondrop,
		children = () => m.dropFiles()
	}: {
		ondrop: DragEventHandler<HTMLDivElement> | null;
		children?: () => any;
	} = $props();
	let active = $state(false);
	let discoverable = $state(false);
</script>

<div
	role="button"
	tabindex="-1"
	ondrop={(e) => {
		e.preventDefault();
		active = false;
		if (ondrop) {
			ondrop(e);
		}
	}}
	ondragover={(e) => {
		e.preventDefault();
		active = true;
	}}
	ondragleave={() => {
		active = false;
	}}
	class="dropzone"
	class:active
	class:discoverable
>
	<span>
		{@render children()}
	</span>
</div>

<svelte:body
	ondragover={() => {
		discoverable = true;
	}}
	ondragleave={debounce(() => {
		discoverable = false;
	}, 1000)}
/>

<style>
	.dropzone {
		background: #222;
		color: #fff;
		border-radius: 0.5rem;
		position: absolute;
		width: 100%;
		height: 100%;
		z-index: 1;
		font-weight: bold;
		font-size: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		display: flex;
		opacity: 0;
		transition: opacity 0.2s;
		visibility: hidden;
	}
	.discoverable {
		visibility: visible;
	}
	.active {
		opacity: 0.8;
	}
</style>
