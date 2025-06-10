<script lang="ts">
	import { debounce } from '$lib/debounce';
	import type { PDFPageProxy } from 'pdfjs-dist';
	import type { TextItem } from 'pdfjs-dist/types/src/display/api';
	import * as m from '$lib/paraglide/messages';
	import { PDFJS } from '$lib/pdf.svelte';

	type TextItemWithContent = TextItem & {
		content: Slottable[];
	};

	let {
		src,
		scale,
		transformTextItems = (items: TextItem[][]) =>
			items.map((textItems) =>
				textItems.map((item) => ({
					...item,
					content: [document.createTextNode(item.str)]
				}))
			)
	}: {
		src: string;
		scale: number;
		transformTextItems?: (
			textItems: TextItem[][]
		) => Promise<TextItemWithContent[][]> | TextItemWithContent[][];
	} = $props();

	let actualScale = $state(scale);
	let scalingDelta = $derived(scale - actualScale);

	$effect(() => {
		isLoading = true;
		(PDFJS()
			? PDFJS()
					.getDocument(src)
					.promise.then((pdf) =>
						Promise.all(
							Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1))
						)
					)
			: Promise.resolve(null)
		).then((data) => {
			pages = data;
			isLoading = false;
		});
	});
	let isLoading = $state(true);
	let pages = $state(null) as PDFPageProxy[] | null;

	const rawTextItems = $derived(
		pages
			? Promise.all(pages.map((page) => page.getTextContent())).then(
					(textContents) => textContents.map(({ items }) => items as TextItem[])
				)
			: null
	);

	const textItems = $derived(rawTextItems?.then(transformTextItems));

	const render = (node: HTMLDivElement, page: PDFPageProxy) => {
		let width: number;
		let height: number;
		const start = (scale: number) => {
			const viewport = page.getViewport({ scale });
			const canvas = document.createElement('canvas');
			const canvasContext = canvas.getContext('2d')!;
			const dpr = window.devicePixelRatio || 1;
			canvas.width = viewport.width * dpr;
			canvas.height = viewport.height * dpr;
			width = canvas.width;
			height = canvas.height;
			node.style.width = `${viewport.width}px`;
			node.style.height = `${viewport.height}px`;
			node.replaceChildren(canvas);
			const scaledViewport = page.getViewport({ scale: scale * dpr });
			page
				.render({
					canvasContext,
					viewport: scaledViewport,
					transform: [1, 0, 0, 1, 0, 0]
				})
				.promise.then(() => {
					actualScale = scale;
				});
			textItems?.then((items) => {
				for (const item of items[page.pageNumber - 1]) {
					const transform = PDFJS().Util.transform(
						viewport.transform,
						item.transform
					);
					const fontSize = Math.hypot(transform[2], transform[3]);
					const span = document.createElement('span');
					span.className = 'textNode';
					// @ts-expect-error content is of reasonable size
					span.append(...item.content);
					span.style.left = `${transform[4] / dpr}px`;
					span.style.top = `${(transform[5] - fontSize) / dpr}px`;
					span.style.fontSize = `${fontSize / dpr}px`;
					span.style.fontFamily = item.fontName;
					span.style.transform = `rotate(${Math.atan2(transform[1], transform[0]) * (180 / Math.PI)}deg)`;
					node.appendChild(span);
				}
			});
		};
		start(scale);
		const debouncedRender = debounce(start, 100);

		$effect(() => {
			const scaleRatio = 1 + scalingDelta;
			node.style.width = `${width * scaleRatio}px`;
			node.style.height = `${height * scaleRatio}px`;
			node.style.transform = `scale(${scaleRatio}) translateY(${
				(height * scalingDelta) / 2
			})`;
			debouncedRender(scale);
		});
	};
</script>

<div class="container">
	{#if PDFJS()}
		{#if isLoading}
			<p>{m.loadingPages()}</p>
		{/if}
		{#if pages}
			{#key [pages, textItems]}
				{#each pages as page}
					<div use:render={page}></div>
				{/each}
			{/key}
		{/if}
	{:else}
		<p>{m.loading()}</p>
	{/if}
</div>

<style>
	.container {
		flex: 1;
		overflow-y: auto;
		background: var(--bg4-color);
		position: relative;

		:global(canvas) {
			max-width: 100%;
			height: auto;
		}

		div {
			position: relative;
			transform-origin: top left;
		}

		:global(.textNode) {
			position: absolute;
			color: transparent;
			white-space: pre;
			transform-origin: 0 0;
			font-variant-ligatures: none;
		}
		:global(span[data-prev]) {
			background: #a0a0f055;
			cursor: pointer;
			font: inherit;
			position: relative;
			border-radius: 0.25rem;
			&.hover {
				background: #8080f055;
			}
		}
	}
	p {
		position: absolute;
		background: var(--bg-color);
		z-index: 10;
		padding: 0.5rem;
		border-radius: 0.5rem;
		top: 1rem;
		left: 1rem;
	}
</style>
