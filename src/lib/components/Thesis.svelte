<script lang="ts">
	import FileButton from './FileButton.svelte';
	import FileCard from './FileCard.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { FileData } from '$lib/server/files';
	import type { Role } from '$lib/server/db';
	import Dropzone from './Dropzone.svelte';
	import { trpc } from '$lib/trpc/client.svelte';
	import ThesisPDFView from './ThesisPDFView.svelte';
	import Overlay from './Overlay.svelte';

	const {
		data: _data,
		role,
		roomId
	}: {
		data: FileData[];
		role: Role;
		roomId: string;
	} = $props();

	const data = $state(_data);
	let src = $state('');
	let isOpen = $state(false);
	let isMenuOpen = $state(false);
	let active = $state(false);

	const file = $derived({
		...data.at(-1)!,
		name: m.thesis()
	});

	const onchange = (e: Event) => {
		handleUpload((e.currentTarget as HTMLInputElement).files);
	};

	const ondrop = (e: DragEvent) => {
		handleUpload(e.dataTransfer!.files);
	};

	const handleUpload = async (filesToUpload: FileList | null) => {
		if (filesToUpload && filesToUpload.length === 1) {
			const file = filesToUpload[0];

			const fileData: FileData = {
				name: file.name,
				size: file.size,
				uploaded: new Date(),
				isPending: true
			};
			data.push(fileData);

			const { url } = await trpc.room.project.thesis.upload.query({
				roomId
			});

			fetch(url, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/pdf'
				},
				body: file
			}).then(() => {
				const item = data.at(-1)!;
				item.isPending = false;
				item.uploaded = new Date();
			});
		}
	};

	const onclick = () => {
		trpc.room.project.thesis.get
			.query({
				roomId,
				isDownload: false,
				fileName: data.at(-1)!.name.replace('thesis/', '')
			})
			.then(({ url }) => {
				src = url;
				isOpen = true;
			});
	};
</script>

{#if isMenuOpen}
	<Overlay
		onclick={() => {
			isMenuOpen = false;
		}}
		onoutroend={() => {
			active = false;
		}}
	/>
{/if}

<div>
	<Dropzone {ondrop} />
	{#if data.length > 0}
		<FileCard
			{file}
			bind:isMenuOpen
			toggleMenu={() => {
				isMenuOpen = !isMenuOpen;
			}}
			active
			{onclick}
			buttons={[
				{
					text: m.openFile(),
					onclick
				}
			]}
		/>
	{:else}
		<p>No thesis file</p>
	{/if}
</div>

{#if role === 'student'}
	<FileButton
		class="btn"
		input={{
			onchange,
			accept: 'application/pdf'
		}}
	>
		{m.addFile()}
	</FileButton>
{/if}

<ThesisPDFView {src} bind:isOpen />

<style>
	div {
		position: relative;
	}
</style>
