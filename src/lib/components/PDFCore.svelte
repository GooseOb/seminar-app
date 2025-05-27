<script lang="ts">
	import { browser } from '$app/environment';
	import { debounce } from '$lib/debounce';
	import type { PDFPageProxy } from 'pdfjs-dist';
	import type { TextContent } from 'pdfjs-dist/types/src/display/api';
	import type { PageViewport } from 'pdfjs-dist/types/src/display/xfa_layer';

	let {
		src,
		scale
	}: {
		src: string;
		scale: number;
	} = $props();

	let PDFJS: typeof import('pdfjs-dist') = $state(null)!;

	const pages = $derived(
		PDFJS
			? PDFJS.getDocument(src).promise.then((pdf) =>
					Promise.all(
						Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1))
					)
				)
			: Promise.resolve(null)
	);

	const render = (node: HTMLDivElement, page: PDFPageProxy) => {
		const appendText = debounce(
			(textContent: TextContent, viewport: PageViewport) => {
				textContent.items.forEach((item) => {
					const transform = PDFJS.Util.transform(
						viewport.transform,
						item.transform
					);
					const fontSize = Math.hypot(transform[2], transform[3]);
					const span = document.createElement('span');
					span.textContent = item.str;
					span.style.left = `${transform[4]}px`;
					span.style.top = `${transform[5] - fontSize}px`;
					span.style.fontSize = `${fontSize}px`;
					span.style.fontFamily = item.fontName;
					span.style.transform = `rotate(${Math.atan2(transform[1], transform[0]) * (180 / Math.PI)}deg)`;
					node.appendChild(span);
				});
			},
			500
		);
		$effect(() => {
			node.textContent = '';
			const canvas = document.createElement('canvas');
			const canvasContext = canvas.getContext('2d')!;
			const viewport = page.getViewport(viewportParams);
			canvas.width = viewport.width;
			canvas.height = viewport.height;
			node.style.width = `${viewport.width}px`;
			node.style.height = `${viewport.height}px`;
			node.appendChild(canvas);
			page.render({
				canvasContext,
				viewport
			});
			page.getTextContent().then((textContent) => {
				appendText(textContent, viewport);
			});
		});
	};

	if (browser) {
		Promise.all([
			import('pdfjs-dist'),
			import('pdfjs-dist/build/pdf.worker.min.mjs?url')
		]).then(([pdfjs, worker]) => {
			pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
			PDFJS = pdfjs;
		});
	}

	const viewportParams = $derived({
		scale
	});
</script>

{#if PDFJS}
	<div class="container">
		{#await pages}
			<p>Loading pages...</p>
		{:then pages}
			{#if pages}
				{#each pages as page}
					<div use:render={page}></div>
				{/each}
			{/if}
		{/await}
	</div>
{:else}
	<p>Loading...</p>
{/if}

<style>
	.container {
		flex: 1;
		overflow-y: auto;
		background: var(--bg4-color);
		:global(canvas) {
			max-width: 100%;
			height: auto;
		}

		:global(div) {
			position: relative;
		}

		:global(span) {
			position: absolute;
			color: transparent;
			white-space: pre;
			transform-origin: 0 0;
		}
	}
</style>
