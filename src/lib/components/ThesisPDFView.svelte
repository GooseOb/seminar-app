<script lang="ts">
	import PdfView from './PDFView.svelte';
	import Select from './Select.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { FileData } from '$lib/server/files';
	import { trpc } from '$lib/trpc/client.svelte';

	let {
		versions,
		isOpen = $bindable(),
		roomId
	}: { versions: FileData[]; isOpen: boolean; roomId: string } = $props();

	let selectedVersion = $derived(versions.at(-1)!.name);
	let prevVersion = $derived(versions.at(-1)!.name);

	const srcPromise = $derived(
		trpc.room.project.thesis.get
			.query({
				roomId,
				isDownload: false,
				fileName: selectedVersion.replace('thesis/', '')
			})
			.then(({ url }) => url)
	);

	const prevVersions = $derived(
		versions.slice(versions.findIndex((v) => v.name === selectedVersion))
	);

	const options = $derived(
		versions.map((v) => ({
			value: v.name,
			displayName: v.uploaded.toLocaleString()
		}))
	);
	const prevOptions = $derived(
		prevVersions.map((v) => ({
			value: v.name,
			displayName: v.uploaded.toLocaleString()
		}))
	);
</script>

{#await srcPromise}
	<p>Loading...</p>
{:then src}
	<PdfView {src} bind:isOpen>
		<div class="top-bar">
			<div class="buttons">
				<button class="btn2" aria-label={m.downloadFile()}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
						><path
							d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"
						/></svg
					>
				</button>
				<button class="btn2" aria-label={m.deleteFile()}>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"
						><path
							d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
						/></svg
					>
				</button>
			</div>
			<Select label={m.compare()} bind:value={selectedVersion} {options} />
			<Select label={m.to()} bind:value={prevVersion} options={prevOptions} />
		</div>
	</PdfView>
{/await}

<style>
	.top-bar {
		display: flex;
		text-align: center;
		width: 100%;
		padding: 0 0.5rem;
		gap: 0.25rem;
	}
	.buttons {
		display: flex;
		gap: 0.5rem;
	}

	@media (max-width: 600px) {
		.top-bar {
			flex-wrap: wrap;
			text-align: left;
		}
	}

	.btn2 {
		fill: var(--fg-color);
		padding: 0 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2.5em;
	}
</style>
