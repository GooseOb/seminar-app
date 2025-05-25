<script lang="ts">
	import type { FileData } from '$lib/server/files';
	import DropdownMenu from './DropdownMenu.svelte';
	import * as m from '$lib/paraglide/messages';

	let {
		file,
		toggleMenu,
		isMenuOpen = $bindable(),
		onclick,
		buttons,
		active
	}: {
		file: FileData;
		toggleMenu: () => void;
		isMenuOpen: boolean;
		onclick: () => void;
		buttons: {
			text: string;
			onclick: () => void;
		}[];
		active: boolean;
	} = $props();

	const date = new Date(file.uploaded).toLocaleString();
</script>

<div
	role="button"
	tabindex="0"
	{onclick}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			onclick();
		}
	}}
	class="card"
	class:active
	class:pending={file.isPending}
>
	<div class="content">
		<div class="name">{file.name}</div>
		<div class="details">
			{(file.size / 1e3).toFixed(2)} KB, {file.uploader
				? m.uploadedBy({ date, name: file.uploader })
				: m.uploaded({ date })}
		</div>
	</div>
	<div class="menu-container">
		<button
			class="menu-btn"
			onclick={(e) => {
				e.stopPropagation();
				toggleMenu();
			}}
		>
			⋮
		</button>
		{#if active && isMenuOpen}
			<DropdownMenu bind:isOpen={isMenuOpen} {buttons} />
		{/if}
	</div>
</div>

<style>
	.card {
		position: relative;
		background: var(--bg2-color);
		margin-bottom: 0.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.2s;
		&:hover {
			background: var(--bg4-color);
		}
		&.active {
			z-index: 9;
		}
		display: flex;
		align-items: stretch;
	}
	.pending {
		opacity: 0.5;
	}

	.content {
		flex-grow: 1;
		padding: 1rem;
	}

	.name {
		font-weight: bold;
		margin-bottom: 0.3rem;
	}

	.details {
		font-size: 0.9rem;
		opacity: 0.8;
	}

	.menu-container {
		position: relative;
		flex: 0 0 10%;
		min-width: 60px;
		display: flex;
		align-items: stretch;
	}

	.menu-btn {
		background: var(--bg3-color);
		font-size: 2rem;
		font-weight: bold;
		cursor: pointer;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 0 0.5rem 0.5rem 0;
		border: none;
		transition: opacity 0.2s;
		opacity: 0.8;
		&:hover {
			opacity: 1;
		}
	}
</style>
