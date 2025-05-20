<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import type { FileItem } from '$lib/server/files';
	import { onDestroy } from 'svelte';
	import DropdownMenu from './DropdownMenu.svelte';
	import Dropzone from './Dropzone.svelte';
	import ImageView from './ImageView.svelte';
	import Overlay from './Overlay.svelte';

	const { files: filesPromise, roomId } = $props();

	type FileItemWithBlob = FileItem & { blobUrl?: string; blobType?: string };

	let files: FileItemWithBlob[] = $state([]);

	$effect(() => {
		filesPromise.then((initialFiles: FileItem[]) => {
			files = initialFiles;
		});
		return () => {
			files.length = 0;
		};
	});

	let fileInput: HTMLInputElement = $state(null)!;

	let showMenuIndex: number | null = $state(null);
	let isClosingMenu = $state(false);

	let isImageView = $state(false);
	let imageSrc = $state('');

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

	const requestFileUrls = <TResponse extends Res>(
		action: string,
		body: object
	) =>
		fetch(`/api/rooms/${roomId}/files/${action}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => res.json<TResponse>());

	const handleDownload = (file: { name: string }) => {
		requestFileUrls<Res>('get', {
			fileNames: [file.name],
			isDownload: true
		}).then(({ urls }) => {
			for (const url of urls) {
				const a = document.createElement('a');
				a.href = url;
				a.download = file.name;
				a.click();
			}
		});
	};

	const handleDelete = (file: { name: string; isPending?: boolean }) => {
		file.isPending = true;
		requestFileUrls<Res>('delete', {
			fileNames: [file.name]
		})
			.then(({ urls }) =>
				fetch(urls[0], {
					method: 'DELETE'
				})
			)
			.then(() => {
				files = files.filter((item) => item.name !== file.name);
			});
	};

	const openBlob = (blobUrl: string, blobType: string) => {
		if (blobType.startsWith('image/')) {
			isImageView = true;
			imageSrc = blobUrl;
		} else if (blobType.startsWith('application/pdf')) {
			// TODO: Add in-app view
			window.open(blobUrl, '_blank');
		} else {
			window.open(blobUrl, '_blank');
		}
	};

	const handleOpen = (file: FileItemWithBlob) => {
		if (file.blobUrl) {
			openBlob(file.blobUrl, file.blobType!);
		} else {
			requestFileUrls<Res>('get', {
				fileNames: [file.name],
				isDownload: false
			})
				.then(({ urls }) => fetch(urls[0]))
				.then((res) => res.blob())
				.then((blob) => {
					const url = URL.createObjectURL(blob);
					file.blobUrl = url;
					file.blobType = blob.type;
					openBlob(url, blob.type);
				});
		}
		showMenuIndex = null;
	};
	onDestroy(() => {
		for (const { blobUrl } of files) {
			if (blobUrl) {
				URL.revokeObjectURL(blobUrl);
			}
		}
	});

	const onchange = (e: Event) => {
		handleUpload((e.currentTarget as HTMLInputElement).files);
	};

	const ondrop = (e: DragEvent) => {
		handleUpload(e.dataTransfer!.files);
	};

	const handleUpload = async (filesToUpload: FileList | null) => {
		if (filesToUpload && filesToUpload.length > 0) {
			const arr = Array.from(filesToUpload);

			const fileItems: FileItem[] = arr.map((file) => ({
				name: file.name,
				size: file.size,
				uploaded: new Date(),
				uploader: 'me',
				isPending: true
			}));
			files = files
				.filter((item) => !fileItems.some((f) => f.name === item.name))
				.concat(fileItems);

			const { urls, uploader } = await requestFileUrls<UploadRes>('upload', {
				fileNames: arr.map(({ name }) => name)
			});

			arr.forEach((file, i) => {
				fetch(urls[i], {
					method: 'PUT',
					headers: {
						'Content-Type': file.type,
						'x-amz-meta-uploader': uploader
					},
					body: file
				}).then(() => {
					const item = files.find((item) => item.name === file.name)!;
					item.isPending = false;
					item.uploader = uploader;
					item.uploaded = new Date();
				});
			});
		}
	};
</script>

{#if showMenuIndex !== null && !isClosingMenu}
	<Overlay
		onclick={() => {
			isClosingMenu = true;
		}}
		onoutroendcapture={() => {
			showMenuIndex = null;
			isClosingMenu = false;
		}}
	/>
{/if}
<ul class="nolist file-list">
	<Dropzone {ondrop} />
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
						<DropdownMenu
							onEachClick={() => {
								isClosingMenu = true;
							}}
							buttons={[
								{
									text: 'Open',
									onclick: () => handleOpen(file)
								},
								{
									text: 'Download',
									onclick: () => handleDownload(file)
								},
								{
									text: 'Delete',
									onclick: () => handleDelete(file)
								}
							]}
						/>
					{/if}
				</div>
			</div>
		</li>
	{/each}
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

<ImageView bind:isOpen={isImageView} src={imageSrc} />

<style>
	.file-list {
		padding: 1rem 0;
		position: relative;
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

	.btn {
		width: 100%;
	}
</style>
