<script lang="ts">
	import { browser } from '$app/environment';
	import { debounce } from '$lib/debounce';
	import type { PDFPageProxy } from 'pdfjs-dist';

	let {
		src,
		scale
	}: {
		src: string;
		scale: number;
	} = $props();

	let actualScale = $state(0);

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
		const start = () => {
			const viewport = page.getViewport({ scale });
			const canvas = document.createElement('canvas');
			const canvasContext = canvas.getContext('2d')!;
			canvas.width = viewport.width;
			canvas.height = viewport.height;
			node.style.width = `${viewport.width}px`;
			node.style.height = `${viewport.height}px`;
			node.replaceChildren(canvas);
			page
				.render({
					canvasContext,
					viewport
				})
				.promise.then(() => {
					actualScale = scale;
				});
			page.getTextContent().then((textContent) => {
				for (const item of textContent.items) {
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
				}
			});
		};
		start();
		const debouncedRender = debounce(start, 100);

		$effect(() => {
			const delta = scale - actualScale;
			node.style.transform = `scale(${1 + delta})`;
			if (delta) {
				debouncedRender();
			}
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
			transform-origin: top left;
		}

		:global(span) {
			position: absolute;
			color: transparent;
			white-space: pre;
			transform-origin: 0 0;
		}
	}
</style>
