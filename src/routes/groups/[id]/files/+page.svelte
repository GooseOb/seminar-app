<script lang="ts">
	import { blur, slide } from 'svelte/transition';
	let { data } = $props();
	let showMenuIndex: number | null = $state(null);

	const toggleMenu = (index: number | null) => {
		showMenuIndex = showMenuIndex === index ? null : index;
	};

	const handleDownload = (file: { name: string }) => {
		alert(`Downloading ${file.name}`);
	};

	const handleRename = (file: { name: string }) => {
		alert(`Renaming ${file.name}`);
	};

	const handleDelete = (file: { name: string }) => {
		if (confirm(`Delete ${file.name}?`)) {
			alert(`Deleted ${file.name}`);
		}
	};

	const handleOpen = (file: { name: string }) => {
		alert(`Opening ${file.name}`);
	};
	let notClosingMenu = $state(true);
</script>

{#snippet button(onclick: () => void, text: string)}
	<button
		onclick={(e) => {
			e.stopPropagation();
			onclick();
			showMenuIndex = null;
		}}>{text}</button
	>
{/snippet}

{#if showMenuIndex !== null && notClosingMenu}
	<button
		aria-hidden="true"
		transition:blur
		class="overlay"
		onclick={() => {
			notClosingMenu = false;
		}}
		onoutroendcapture={() => {
			showMenuIndex = null;
			notClosingMenu = true;
		}}
	></button>
{/if}
<div class="file-list">
	<ul class="nolist">
		{#each data.files as file, index}
			<li
				aria-hidden="true"
				class="file-item"
				class:active={showMenuIndex === index}
				onclick={() => handleOpen(file)}
			>
				<div class="file-row">
					<div class="file-content">
						<div class="file-name">{file.name}</div>
						<div class="file-details">
							{file.size} KB, modified by {file.modifiedBy}
						</div>
					</div>
					<div class="menu-container">
						<button
							class="menu-btn"
							onclick={(e) => {
								e.stopPropagation();
								toggleMenu(index);
							}}
						>
							⋮
						</button>
						{#if showMenuIndex === index && notClosingMenu}
							<div class="dropdown-menu" transition:slide>
								{@render button(() => handleOpen(file), 'Open')}
								{@render button(() => handleDownload(file), 'Download')}
								{@render button(() => handleRename(file), 'Rename')}
								{@render button(() => handleDelete(file), 'Delete')}
							</div>
						{/if}
					</div>
				</div>
			</li>
		{/each}
	</ul>
</div>

<style>
	.file-list {
		padding: 1rem 0;
	}
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

	.file-item {
		position: relative;
		background: var(--bg2-color);
		margin-bottom: 0.5rem;
		border-radius: 0.5rem;
		cursor: pointer;
		transition: background 0.2s;
	}
	.file-item:hover {
		background: var(--bg4-color);
	}
	.file-item.active {
		z-index: 9;
	}

	.file-row {
		display: flex;
		align-items: stretch;
	}

	.file-content {
		flex-grow: 1;
		padding: 1rem;
	}

	.file-name {
		font-weight: bold;
		margin-bottom: 0.3rem;
	}

	.file-details {
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
		opacity: 0.8;
		transition: opacity 0.2s;
	}
	.menu-btn:hover {
		opacity: 1;
	}

	.dropdown-menu {
		position: absolute;
		right: 0;
		top: 100%;
		background: var(--bg2-color);
		border-radius: 0.5rem;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
		z-index: 10;
		overflow: hidden;
	}

	.dropdown-menu button {
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

	.dropdown-menu button:hover {
		background: var(--bg3-color);
	}
</style>
