<script lang="ts">
	import { slide } from 'svelte/transition';

	let {
		buttons,
		isOpen = $bindable()
	}: {
		buttons: { text: string; onclick: () => void }[];
		isOpen?: boolean;
	} = $props();
</script>

<div transition:slide>
	{#each buttons as { text, onclick } (text)}
		<button
			onclick={(e) => {
				e.stopPropagation();
				onclick();
				isOpen = false;
			}}
		>
			{text}
		</button>
	{/each}
</div>

<style>
	div {
		position: absolute;
		right: 0;
		top: 100%;
		background: var(--bg2-color);
		border-radius: 0.5rem;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		z-index: 10;
		overflow: hidden;
	}

	button {
		display: block;
		width: 100%;
		padding: 0.8rem 1.5rem;
		text-align: left;
		background: transparent;
		border: none;
		cursor: pointer;
		transition: background 0.2s;
		font-size: 1.1rem;
		font-weight: 500;
	}

	button:hover {
		background: var(--bg3-color);
	}
</style>
