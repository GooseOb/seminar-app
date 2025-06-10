<script lang="ts">
	import PdfView from './PDFView.svelte';
	import Select from './Select.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { FileData } from '$lib/server/files';
	import { trpc } from '$lib/trpc/client.svelte';
	import DownloadIcon from './icons/DownloadIcon.svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';
	import { PDFJS } from '$lib/pdf.svelte';
	import { diff } from '$lib/diff';
	import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';
	import { flatten } from '$lib/flatten';

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

	const getThesis = (version: string) =>
		trpc.room.project.thesis.get.query({
			roomId,
			isDownload: false,
			fileName: version.replace('thesis/', '')
		});

	let src: string = $state('');
	$effect(() => {
		getThesis(selectedVersion).then(({ url }) => {
			src = url;
		});
	});

	const prevVersions = $derived(
		versions.slice(0, versions.findIndex((v) => v.name === selectedVersion) + 1)
	);

	let prevPdfPageTextContents: TextContent[] | null = $state(null);
	$effect(() => {
		if (prevVersion === selectedVersion) {
			prevPdfPageTextContents = null;
		} else {
			getThesis(prevVersion)
				.then(({ url }) => PDFJS()!.getDocument(url).promise)
				.then((pdf) =>
					Promise.all(
						Array.from({ length: pdf.numPages }, (_, i) =>
							pdf.getPage(i + 1).then((page) => page.getTextContent())
						)
					)
				)
				.then((pdf) => {
					prevPdfPageTextContents = pdf;
				});
		}
	});

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
	let prevTexts: string[] = $state([]);
	let selectedDiffEl: HTMLElement | null = null;
	const hovers: HTMLElement[] = [];
	let currHover: string = $state('');
	const onmouseover = (e: Event) => {
		const { dataset } = e.target as HTMLElement;
		if ('prev' in dataset) {
			const value = dataset.prev!;
			if (currHover === value) return;
			for (const el of hovers) {
				el.classList.remove('hover');
			}
			currHover = value;
			for (const el of (
				e.currentTarget as HTMLElement
			).querySelectorAll<HTMLElement>(`span[data-prev="${value}"]`)) {
				el.classList.add('hover');
				hovers.push(el);
			}
		} else {
			for (const el of hovers) {
				el.classList.remove('hover');
			}
			currHover = '';
		}
	};
	let child: HTMLElement = $state(null)!;
</script>

{#if src}
	{#key prevPdfPageTextContents}
		<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
		<div
			onclick={(e) => {
				const el = e.target as HTMLElement;
				if ('prev' in el.dataset) {
					child.style.visibility = 'hidden';
					if (selectedDiffEl === el) {
						selectedDiffEl = null;
					} else {
						const { bottom, left } = el.getBoundingClientRect();
						child.style.top = `${bottom + 5}px`;
						child.style.left = `${left}px`;
						child.style.visibility = 'visible';
						child.textContent = prevTexts[+el.dataset.prev!];
						selectedDiffEl = el;
					}
				} else if (selectedDiffEl) {
					child.style.visibility = 'hidden';
					selectedDiffEl = null;
				}
			}}
			{onmouseover}
			onfocus={onmouseover}
		>
			<PdfView
				{src}
				bind:isOpen
				transformTextItems={(origTextItems, fallback) => {
					if (prevPdfPageTextContents) {
						const { value: textItems, unflatten } = flatten(origTextItems);
						const prevTextItems = prevPdfPageTextContents.flatMap(
							({ items }) => items as TextItem[]
						);
						const { result, content } = diff(
							textItems.map((item) => item.str),
							prevTextItems.map((item) => item.str)
						);
						prevTexts = content;
						return unflatten(
							textItems.map((item, i) => ({
								...item,
								content: result[i] || [document.createTextNode(item.str)]
							}))
						);
					}
					return fallback(origTextItems);
				}}
			>
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
					<Select
						label={m.to()}
						bind:value={prevVersion}
						options={prevOptions}
					/>
				</div>
			</PdfView>
		</div>
	{/key}
	<div class="prev" bind:this={child}></div>
{/if}

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
	.prev {
		position: fixed;
		display: block;
		visibility: hidden;
		background: var(--bg4-color);
		color: var(--fg-color);
		border: 3px solid var(--bg3-color);
		border-radius: 0.5rem;
		padding: 0.25rem;
		z-index: 20;
	}
</style>
