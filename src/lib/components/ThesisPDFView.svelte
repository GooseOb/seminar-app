<script lang="ts">
	import PdfView from './PDFView.svelte';
	import Select from './Select.svelte';
	import * as m from '$lib/paraglide/messages';
	import type { FileData } from '$lib/server/files';
	import { trpc } from '$lib/trpc/client.svelte';
	import DownloadIcon from './icons/DownloadIcon.svelte';
	import DeleteIcon from './icons/DeleteIcon.svelte';
	import { PDFJS } from '$lib/pdf.svelte';
	import { diff } from '$lib/pdf/diff';
	import type { TextContent, TextItem } from 'pdfjs-dist/types/src/display/api';
	import { flatten } from '$lib/utils/flatten';
	import type { Role } from '$lib/server/db';
	import { withComments } from '$lib/pdf/comments';
	import { fade, slide } from 'svelte/transition';
	import type { CommentData } from '$lib/pdf/comments';
	import { isInterfering } from '$lib/ranges';

	let {
		versions = $bindable(),
		isOpen = $bindable(),
		roomId,
		role
	}: {
		versions: FileData[];
		isOpen: boolean;
		roomId: number;
		role: Role;
	} = $props();

	const hasIndex = <T extends object>(obj: T): obj is T & { index: string } =>
		Object.prototype.hasOwnProperty.call(obj, 'index');

	let container: HTMLElement = $state(null)!;
	let selectedVersion = $derived(versions.at(-1)!);
	let prevVersion = $derived(versions.at(-1)!);

	let comments: CommentData[] = $state([]);
	let isReviewed = $state(false);

	let isCommentMode = $state(false);

	$effect(() => {
		if (isCommentMode) {
			trpc.room.project.thesis.comments.get
				.query({ roomId, fileName: selectedVersion.name })
				.then((data) => {
					comments = data.comments!;
					isReviewed = data.isReviewed!;
				});
		}
	});

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
	const tooltipTexts = $derived(
		isCommentMode ? comments.map(({ data }) => data) : prevTexts
	);
	let selectedEl: HTMLElement | null = $state(null);
	const hovers: HTMLElement[] = [];
	let currHover: string = $state('');
	const onmouseover = (e: Event) => {
		const { dataset } = e.target as HTMLElement;
		if (hasIndex(dataset)) {
			const value = dataset.index;
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
	let tooltip: HTMLTextAreaElement = $state(null)!;
	const handleSelection = (e: MouseEvent | TouchEvent) => {
		if (!isCommentMode) return;
		unselectSelectedEl();
		if (e.altKey) return;

		const selection = window.getSelection();
		if (!selection?.rangeCount || !selection.toString().trim()) return;

		const selectionRange = selection.getRangeAt(0);
		const commonAncestorContainer =
			selectionRange.commonAncestorContainer as HTMLElement;
		const { startContainer, startOffset } = selectionRange;

		if (container.contains(commonAncestorContainer)) {
			const startEl = startContainer.parentElement!;
			const pageEl = startEl.parentElement!.classList.contains('page')
				? startEl.parentElement
				: startEl.parentElement!.closest<HTMLElement>('page');

			if (!pageEl || !hasIndex(pageEl.dataset)) {
				return;
			}

			const pageIndex = +pageEl.dataset.index;
			const pageEls = pageEl.parentElement!.children;
			let fromIndex = 0;
			for (let i = 0; i < pageIndex; i++) {
				fromIndex += pageEls[i].textContent!.length;
			}

			for (const child of startEl.parentElement!.children) {
				if (child === startEl) {
					for (const el of child.childNodes) {
						if (el === startContainer) {
							break;
						}
						fromIndex += el.textContent!.length;
					}
					fromIndex += startOffset;
					break;
				} else {
					fromIndex += child.textContent!.length;
				}
			}

			newComment = {
				fromIndex,
				toIndex: fromIndex + selection.toString().length,
				data: '',
				isNew: true
			};

			if (isInterfering(comments, newComment)) {
				newComment = null;
				return;
			}

			comments.push(newComment);
			comments.sort((a, b) => a.fromIndex - b.fromIndex);

			setTimeout(() => {
				selectedEl = document.getElementById('newComment')!;
				queueMicrotask(() => {
					tooltip.focus();
				});
			});
		}
	};
	let newComment: CommentData | null = $state(null);
	const unselectSelectedEl = () => {
		if (!selectedEl) return;

		const index = +selectedEl.dataset.index!;
		const selectedComment = comments[index];
		if (selectedComment) {
			if (selectedComment.data.trim()) {
				trpc.room.project.thesis.comments.update.mutate({
					roomId,
					fileName: selectedVersion.name,
					comments: comments.map(({ isNew, ...comment }) => comment)
				});
			} else {
				comments.splice(index, 1);
			}
		}

		if (newComment) {
			newComment.isNew = false;
			newComment = null;
		}

		selectedEl = null;
	};
</script>

{#if src}
	<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
	<div
		onmouseup={handleSelection}
		ontouchend={handleSelection}
		onclick={(e) => {
			const el = e.target as HTMLElement;
			if (hasIndex(el.dataset) && tooltipTexts[+el.dataset.index]) {
				if (selectedEl === el || e.altKey) {
					unselectSelectedEl();
				} else {
					selectedEl = el;
				}
			} else if (selectedEl) {
				unselectSelectedEl();
			}
		}}
		{onmouseover}
		onfocus={onmouseover}
		bind:this={container}
	>
		<PdfView
			{src}
			bind:isOpen
			transformTextItems={isCommentMode
				? comments.length
					? (origTextItems) => {
							const { value: textItems, unflatten } = flatten(origTextItems);
							const result = withComments(
								textItems.map((item) => item.str),
								comments
							);
							return unflatten(
								textItems.map((item, i) => ({
									...item,
									content: result[i]
								}))
							);
						}
					: undefined
				: prevPdfPageTextContents
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
					{/if}
					<button
						class="btn2"
						class:active={isCommentMode}
						aria-label={m.toggleComments()}
						onclick={() => {
							isCommentMode = !isCommentMode;
						}}
					>
						C
					</button>
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
			{#snippet afterPages()}
				{#if isCommentMode && !isReviewed && role === 'lecturer'}
					<button
						transition:fade={{
							duration: 200
						}}
						class="btn submit"
						onclick={() => {
							trpc.room.project.thesis.comments.submit
								.mutate({
									roomId,
									fileName: selectedVersion.name
								})
								.then(() => {
									isReviewed = true;
								});
						}}
					>
						{m.submitReview()}
					</button>
				{/if}
			{/snippet}
		</PdfView>
	</div>
	{#if selectedEl}
		{@const { bottom, left } = selectedEl.getBoundingClientRect()}

		<div
			transition:slide
			class="tooltip"
			style="top: {bottom + 5}px; left: {left}px;"
		>
			{#if isCommentMode}
				<textarea
					bind:this={tooltip}
					disabled={role === 'student' || selectedVersion !== versions.at(-1)}
					bind:value={comments[+selectedEl.dataset.index!]!.data}
					placeholder={m.addComment()}
				></textarea>
			{:else}
				<textarea
					transition:slide
					style="top: {bottom + 5}px; left: {left}px;"
					class="tooltip"
					bind:this={tooltip}
					disabled
					value={prevTexts[+selectedEl.dataset.index!]!}
				></textarea>
			{/if}
		</div>
	{/if}
{/if}

<style>
	div {
		:global {
			.diffItem {
				background: #a0a0f055;
				cursor: pointer;
				font: inherit;
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
			.commentItem {
				background: #f0c00055;
				cursor: pointer;
				font: inherit;
				border-radius: 0.25rem;
				transition: background 0.1s ease-in-out;
				&.hover {
					background: #f0f00055;
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
		background: var(--bg4-color);
		color: var(--fg-color);
		transition:
			top 0.2s ease-in-out,
			left 0.2s ease-in-out;
		border: 3px solid var(--bg3-color);
		border-radius: 0.5rem;
		padding: 0.25rem;
		z-index: 20;
	}
	.submit {
		position: absolute;
		bottom: 0rem;
		left: 0;
		width: 100%;
	}
</style>
