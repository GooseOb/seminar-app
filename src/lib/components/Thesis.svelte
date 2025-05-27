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

	let {
		versions = $bindable(),
		role,
		roomId
	}: {
		versions: FileData[];
		role: Role;
		roomId: string;
	} = $props();

	let isOpen = $state(false);
	let isMenuOpen = $state(false);
	let active = $state(false);

	const file = $derived({
		...versions.at(-1)!,
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
			versions.push(fileData);

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
				const item = versions.at(-1)!;
				item.isPending = false;
				item.uploaded = new Date();
			});
		}
	};

	const onclick = () => {
		isOpen = true;
	};

	const isStudent = $derived(role === 'student');
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
	{#if versions.length > 0}
		<FileCard
			{file}
			bind:isMenuOpen
			toggleMenu={() => {
				active = true;
				isMenuOpen = !isMenuOpen;
			}}
			{active}
			{onclick}
			buttons={[
				{
					text: m.openFile(),
					onclick
				}
			]}
		/>

		<ThesisPDFView bind:versions {roomId} bind:isOpen canDelete={isStudent} />
	{:else}
		<p>No thesis file</p>
	{/if}
</div>

{#if isStudent}
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

<style>
	div {
		position: relative;
	}
</style>
