<script lang="ts">
	import type { DragEventHandler } from 'svelte/elements';

	const { ondrop }: { ondrop: DragEventHandler<HTMLDivElement> | null } =
		$props();
	let isDragging = $state(false);
</script>

<div
	role="button"
	tabindex="-1"
	ondrop={(e) => {
		e.preventDefault();
		isDragging = false;
		if (ondrop) {
			ondrop(e);
		}
	}}
	ondragover={(e) => {
		e.preventDefault();
		isDragging = true;
	}}
	ondragleave={() => {
		isDragging = false;
	}}
	class="dropzone"
	class:active={isDragging}
>
	Drop files here
</div>

<style>
	.dropzone {
		background: #222c;
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
		visibility: hidden;
	}
	.dropzone.active {
		visibility: visible;
	}
</style>
