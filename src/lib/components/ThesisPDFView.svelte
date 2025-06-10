<script lang="ts">
	import PdfView from './PDFView.svelte';
	import Select from './Select.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { FileData } from '$lib/server/files';
	import { trpc } from '$lib/trpc/client.svelte';
	import DownloadIcon from './icons/DownloadIcon.svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';
	import { PDFJS } from '$lib/pdf.svelte';
	import { diff } from '$lib/pdf/diff';
	import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';
	import { flatten } from '$lib/utils/flatten';
	import type { Role } from '$lib/server/db';

	let {
		versions = $bindable(),
		isOpen = $bindable(),
		roomId,
		role
	}: {
		versions: FileData[];
		isOpen: boolean;
		roomId: string;
		role: Role;
	} = $props();

	let selectedVersion = $derived(versions.at(-1)!);
	let prevVersion = $derived(versions.at(-1)!);

	let isCommentMode = $state(false);

	const getThesis = (fileName: string) =>
		trpc.room.project.thesis.get.query({
			roomId,
			isDownload: false,
			fileName
		});

	let src: string = $state('');
	$effect(() => {
		getThesis(selectedVersion.name).then(({ url }) => {
			src = url;
		});
		if (versions.indexOf(selectedVersion) < versions.indexOf(prevVersion)) {
			prevVersion = selectedVersion;
		}
	});

	const prevVersions = $derived(
		versions.slice(0, versions.indexOf(selectedVersion) + 1)
	);

	let prevPdfPageTextContents: TextContent[] | null = $state(null);
	$effect(() => {
		if (prevVersion === selectedVersion) {
			prevPdfPageTextContents = null;
		} else {
			getThesis(prevVersion.name)
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
		versions.map(({ name }) => ({
			value: name,
			label: new Date(+/\d+(?=\.pdf$)/.exec(name)![0]).toLocaleString()
		}));

	const options = $derived(optionsFrom(versions));
	const prevOptions = $derived(optionsFrom(prevVersions));

	const handleDownload = () => {
		trpc.room.project.thesis.get
			.query({
				roomId,
				isDownload: true,
				fileName: selectedVersion.name
			})
			.then(({ url }) => {
				const a = document.createElement('a');
				a.href = url;
				a.download = selectedVersion.name;
				a.click();
			});
	};
	const handleDelete = () => {
		trpc.room.project.thesis.delete
			.mutate({ roomId, fileName: selectedVersion.name })
			.then(() => {
				versions.splice(versions.indexOf(selectedVersion), 1);
			});
	};
	let prevTexts: string[] = $state([]);
	let selectedDiffEl: HTMLElement | null = null;
	const hovers: HTMLElement[] = [];
	let currHover: string = $state('');
	const onmouseover = (e: Event) => {
		const { dataset } = e.target as HTMLElement;
		if ('index' in dataset) {
			const value = dataset.index!;
			if (currHover === value) return;
			for (const el of hovers) {
				el.classList.remove('hover');
			}
			currHover = value;
			for (const el of (
				e.currentTarget as HTMLElement
			).querySelectorAll<HTMLElement>(`span[data-index="${value}"]`)) {
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
	let tooltip: HTMLElement = $state(null)!;
</script>

{#if src}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		onclick={(e) => {
			const el = e.target as HTMLElement;
			if ('index' in el.dataset && prevTexts[+el.dataset.index!]) {
				tooltip.style.visibility = 'hidden';
				if (selectedDiffEl === el) {
					selectedDiffEl = null;
				} else {
					const { bottom, left } = el.getBoundingClientRect();
					tooltip.style.top = `${bottom + 5}px`;
					tooltip.style.left = `${left}px`;
					tooltip.style.visibility = 'visible';
					tooltip.textContent = prevTexts[+el.dataset.index!];
					selectedDiffEl = el;
				}
			} else if (selectedDiffEl) {
				tooltip.style.visibility = 'hidden';
				selectedDiffEl = null;
			}
		}}
		{onmouseover}
		onfocus={onmouseover}
	>
		<PdfView
			{src}
			bind:isOpen
			transformTextItems={prevPdfPageTextContents
				? (origTextItems) => {
						const { value: textItems, unflatten } = flatten(origTextItems);
						const prevTextItems = prevPdfPageTextContents!.flatMap(
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
								content: result[i]
							}))
						);
					}
				: undefined}
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
					{#if role === 'student'}
						<button
							class="btn2"
							aria-label={m.deleteFile()}
							onclick={handleDelete}
						>
							<DeleteIcon />
						</button>
					{:else if role === 'lecturer'}
						<button
							class="btn2"
							class:active={isCommentMode}
							aria-label="toggle comments"
							onclick={() => {
								isCommentMode = !isCommentMode;
							}}
						>
							C
						</button>
					{/if}
				</div>
				<Select
					label={m.compare()}
					value={selectedVersion.name}
					onchange={(e) => {
						selectedVersion = versions.find(
							({ name }) => name === e.currentTarget.value
						)!;
					}}
					{options}
				/>
				<Select
					label={m.to()}
					value={prevVersion.name}
					onchange={(e) => {
						prevVersion = versions.find(
							({ name }) => name === e.currentTarget.value
						)!;
					}}
					options={prevOptions}
				/>
			</div>
		</PdfView>
	</div>
	<div class="tooltip" bind:this={tooltip}></div>
{/if}

<style>
	div {
		:global {
			.diffItem {
				background: #a0a0f055;
				cursor: pointer;
				font: inherit;
				position: relative;
				border-radius: 0.25rem;
				&.hover {
					background: #8080f055;
				}
				&.new {
					background: #a0f0a055;
					&.hover {
						background: #60f06055;
					}
				}
			}
		}
	}

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
		font-weight: bold;
		&.active {
			background-color: var(--primary-color);
			color: #fff;
		}
	}

	.tooltip {
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
