<script lang="ts">
	import PdfView from './PDFView.svelte';
	import Select from './Select.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { FileData } from '$lib/server/files';
	import { trpc } from '$lib/trpc/client.svelte';
	import DownloadIcon from './icons/DownloadIcon.svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';

	let {
		versions = $bindable(),
		isOpen = $bindable(),
		roomId,
		canDelete
	}: {
		versions: FileData[];
		isOpen: boolean;
		roomId: string;
		canDelete: boolean;
	} = $props();

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

	const optionsFrom = (versions: FileData[]) =>
		versions.map((v) => ({
			value: v.name,
			label: new Date(+/\d+(?=\.pdf$)/.exec(v.name)![0]).toLocaleString()
		}));

	const options = $derived(optionsFrom(versions));
	const prevOptions = $derived(optionsFrom(prevVersions));

	const handleDownload = () => {
		trpc.room.project.thesis.get
			.query({
				roomId,
				isDownload: true,
				fileName: selectedVersion.replace('thesis/', '')
			})
			.then(({ url }) => {
				const a = document.createElement('a');
				a.href = url;
				a.download = selectedVersion.replace('thesis/', '');
				a.click();
			});
	};
	const handleDelete = () => {
		trpc.room.project.thesis.delete
			.mutate({ roomId, fileName: selectedVersion.replace('thesis/', '') })
			.then(() => {
				versions.splice(
					versions.findIndex((v) => v.name === selectedVersion),
					1
				);
			});
	};
</script>

{#await srcPromise}
	<p>{m.loadingThesis()}</p>
{:then src}
	<PdfView {src} bind:isOpen>
		<div class="top-bar">
			<div class="buttons">
				<button
					class="btn2"
					aria-label={m.downloadFile()}
					onclick={handleDownload}
				>
					<DownloadIcon />
				</button>
				{#if canDelete}
					<button
						class="btn2"
						aria-label={m.deleteFile()}
						onclick={handleDelete}
					>
						<DeleteIcon />
					</button>
				{/if}
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
