<script lang="ts">
	import { blur, slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages.js';
	import type { FileItem } from '$lib/files';

	const { files: filesPromise, roomId } = $props();

	let fileList: FileItem[] = $state([]);

	$effect(() => {
		filesPromise.then((initialFiles: FileItem[]) => {
			fileList = initialFiles;
		});
		return () => {
			fileList.length = 0;
		};
	});

	let fileInput: HTMLInputElement = $state(null)!;

	let showMenuIndex: number | null = $state(null);
	let isClosingMenu = $state(false);
	let isDragging = $state(false);

	const toggleMenu = (index: number | null) => {
		if (showMenuIndex === null) {
			showMenuIndex = index;
		} else {
			isClosingMenu = true;
		}
	};

	interface Res {
		urls: string[];
	}
	interface UploadRes extends Res {
		uploader: string;
	}

	const handleDownload = (file: { name: string }) => {
		fetch(`/api/rooms/${roomId}/files/get`, {
			method: 'POST',
			body: JSON.stringify({
				fileNames: [file.name],
				isDownload: true
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then<Res>((res) => res.json())
			.then(({ urls }) => {
				for (const url of urls) {
					const a = document.createElement('a');
					a.href = url;
					a.download = file.name;
					a.click();
				}
			});
	};

	const handleDelete = (file: { name: string; isPending: boolean }) => {
		file.isPending = true;
		fetch(`/api/rooms/${roomId}/files/delete`, {
			method: 'POST',
			body: JSON.stringify({ fileNames: [file.name] }),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then<Res>((res) => res.json())
			.then(({ urls }) =>
				fetch(urls[0], {
					method: 'DELETE'
				})
			)
			.then(() => {
				fileList = fileList.filter((item) => item.name !== file.name);
			});
	};

	const handleOpen = (file: { name: string }) => {
		fetch(`/api/rooms/${roomId}/files/get`, {
			method: 'POST',
			body: JSON.stringify({
				fileNames: [file.name],
				isDownload: false
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then<Res>((res) => res.json())
			.then(({ urls }) => {
				for (const url of urls) {
					const a = document.createElement('a');
					a.href = url;
					a.download = file.name;
					a.click();
				}
			});
	};

	const onchange = (e: Event) => {
		handleFileUpload((e.currentTarget as HTMLInputElement).files);
	};

	const ondrop = (e: DragEvent) => {
		e.preventDefault();
		isDragging = false;
		handleFileUpload(e.dataTransfer!.files);
	};

	const handleFileUpload = async (files: FileList | null) => {
		if (files && files.length > 0) {
			const arr = Array.from(files);

			const fileItems: FileItem[] = arr.map((file) => ({
				name: file.name,
				type: file.type,
				size: file.size,
				uploaded: new Date(),
				uploader: 'me',
				isPending: true
			}));
			fileList = fileList
				.filter((item) => !fileItems.some((f) => f.name === item.name))
				.concat(fileItems);

			const { urls, uploader } = await fetch(
				`/api/rooms/${roomId}/files/upload`,
				{
					method: 'POST',
					body: JSON.stringify({
						fileNames: arr.map(({ name }) => name)
					}),
					headers: {
						'Content-Type': 'application/json'
					}
				}
			).then<UploadRes>((res) => res.json());

			arr.forEach((file, i) => {
				fetch(urls[i], {
					method: 'PUT',
					headers: {
						'Content-Type': file.type,
						'x-amz-meta-uploader': uploader
					},
					body: file
				}).then(() => {
					const item = fileList.find((item) => item.name === file.name)!;
					item.isPending = false;
					item.uploader = uploader;
					item.uploaded = new Date();
				});
			});
		}
	};
</script>

{#snippet button(onclick: () => void, text: string)}
	<button
		onclick={(e) => {
			e.stopPropagation();
			onclick();
			isClosingMenu = true;
		}}>{text}</button
	>
{/snippet}

{#if showMenuIndex !== null && !isClosingMenu}
	<button
		aria-hidden="true"
		transition:blur
		class="overlay"
		onclick={() => {
			isClosingMenu = true;
		}}
		onoutroendcapture={() => {
			showMenuIndex = null;
			isClosingMenu = false;
		}}
	></button>
{/if}
<ul
	class="nolist file-list"
	{ondrop}
	ondragover={(e) => {
		e.preventDefault();
		isDragging = true;
	}}
	ondragleave={() => {
		isDragging = false;
	}}
>
	<div class="dropzone" class:active={isDragging}>Drop files here</div>
	{#await fileList then files}
		{#each files as file, index}
			<li
				aria-hidden="true"
				class="file-item"
				class:active={showMenuIndex === index}
				class:pending={file.isPending}
				onclick={() => handleOpen(file)}
			>
				<div class="file-row">
					<div class="file-content">
						<div class="file-name">{file.name}</div>
						<div class="file-details">
							{(file.size / 1e3).toFixed(2)} KB, uploaded {new Date(
								file.uploaded
							).toLocaleString()} by {file.uploader}
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
						{#if showMenuIndex === index && !isClosingMenu}
							<div class="dropdown-menu" transition:slide>
								{@render button(() => handleOpen(file), 'Open')}
								{@render button(() => handleDownload(file), 'Download')}
								{@render button(() => handleDelete(file), 'Delete')}
							</div>
						{/if}
					</div>
				</div>
			</li>
		{/each}
	{/await}
</ul>
<button
	class="btn"
	onclick={(e) => {
		e.stopPropagation();
		fileInput.click();
	}}
>
	<input type="file" hidden bind:this={fileInput} multiple {onchange} />
	{m.addFile()}
</button>

<style>
	.file-list {
		padding: 1rem 0;
		position: relative;
	}
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
		display: none;
	}
	.dropzone.active {
		display: flex;
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
	.pending {
		opacity: 0.5;
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
	.btn {
		width: 100%;
	}
</style>
