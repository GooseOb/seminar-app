<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import type { FileData } from '$lib/server/files';
	import { onDestroy } from 'svelte';
	import Dropzone from './Dropzone.svelte';
	import ImageView from './ImageView.svelte';
	import Overlay from './Overlay.svelte';
	import PDFView from './PDFView.svelte';
	import { trpc } from '$lib/trpc/client.svelte';
	import FileCard from './FileCard.svelte';
	import FileButton from './FileButton.svelte';

	const {
		files: _files,
		roomId
	}: {
		files: FileData[];
		roomId: number;
	} = $props();

	type BlobData = {
		url: string;
		type: string;
		name: string;
	};
	const file2blob = new Map<FileData, BlobData>();
	onDestroy(() => {
		file2blob.forEach(({ url }) => {
			URL.revokeObjectURL(url);
		});
		file2blob.clear();
	});

	let files: FileData[] = $state(_files);

	let showMenuIndex: number | null = $state(null);
	let isMenuOpen = $state(false);

	const emptyView = () => ({
		src: '',
		name: '',
		isOpen: false
	});
	let pdf = $state(emptyView());
	let image = $state(emptyView());

	const toggleMenu = (index: number | null) => {
		if (showMenuIndex === null) {
			showMenuIndex = index;
			isMenuOpen = true;
		} else {
			isMenuOpen = false;
		}
	};

	const handleDownload = (file: { name: string }) => {
		trpc.room.files.get
			.query({
				roomId,
				fileNames: [file.name],
				isDownload: true
			})
			.then(({ urls }) => {
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
		trpc.room.files.delete
			.mutate({
				roomId,
				fileNames: [file.name]
			})
			.then(() => {
				files = files.filter((item) => item.name !== file.name);
			});
	};

	const openBlob = (data: BlobData) => {
		const fileData = {
			src: data.url,
			name: data.name,
			isOpen: true
		};
		if (data.type.startsWith('image/')) {
			image = fileData;
		} else if (data.type.startsWith('application/pdf')) {
			pdf = fileData;
		} else {
			window.open(data.url, '_blank');
		}
	};

	const handleOpen = (file: FileData) => {
		const blob = file2blob.get(file);
		if (blob) {
			openBlob(blob);
		} else {
			trpc.room.files.get
				.query({
					roomId,
					fileNames: [file.name],
					isDownload: false
				})
				.then(({ urls }) => fetch(urls[0]))
				.then((res) => res.blob())
				.then((blob) => {
					const blobData = {
						url: URL.createObjectURL(blob),
						type: blob.type,
						name: file.name
					};
					file2blob.set(file, blobData);
					openBlob(blobData);
				});
		}
	};

	const onchange = (e: Event) => {
		handleUpload((e.currentTarget as HTMLInputElement).files);
	};

	const ondrop = (e: DragEvent) => {
		handleUpload(e.dataTransfer!.files);
	};

	const handleUpload = async (filesToUpload: FileList | null) => {
		if (filesToUpload && filesToUpload.length > 0) {
			const arr = Array.from(filesToUpload);

			const fileItems: FileData[] = arr.map((file) => ({
				name: file.name,
				size: file.size,
				uploaded: new Date(),
				uploader: 'me',
				isPending: true
			}));
			files = files
				.filter((item) => !fileItems.some((f) => f.name === item.name))
				.concat(fileItems);

			const { urls, uploader } = await trpc.room.files.upload.query({
				roomId,
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
					item.uploader = decodeURIComponent(uploader);
					item.uploaded = new Date();
				});
			});
		}
	};
</script>

{#if showMenuIndex !== null && isMenuOpen}
	<Overlay
		onclick={() => {
			isMenuOpen = false;
		}}
		onoutroend={() => {
			showMenuIndex = null;
		}}
	/>
{/if}
<ul class="nolist list">
	<Dropzone {ondrop} />
	{#if files.length === 0}
		<p>{m.noFiles()}</p>
	{:else}
		{#each files as file, index}
			{@const onclick = () => handleOpen(file)}
			<li>
				<FileCard
					{file}
					bind:isMenuOpen
					toggleMenu={() => {
						toggleMenu(index);
					}}
					active={showMenuIndex === index}
					{onclick}
					buttons={[
						{
							text: m.openFile(),
							onclick
						},
						{
							text: m.downloadFile(),
							onclick: () => handleDownload(file)
						},
						{
							text: m.deleteFile(),
							onclick: () => handleDelete(file)
						}
					]}
				/>
			</li>
		{/each}
	{/if}
</ul>

<FileButton class="btn" input={{ multiple: true, onchange }}>
	{m.addFiles()}
</FileButton>

<ImageView bind:isOpen={image.isOpen} src={image.src} />
<PDFView bind:isOpen={pdf.isOpen} src={pdf.src}>{pdf.name}</PDFView>

<style>
	.list {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.list :global(.btn) {
		width: 100%;
	}
</style>
