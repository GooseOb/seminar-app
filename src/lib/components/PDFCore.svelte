<script lang="ts">
	import { browser } from '$app/environment';
	import type { PDFPageProxy } from 'pdfjs-dist';

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

	const render = (node: HTMLCanvasElement, page: PDFPageProxy) => {
		const canvasContext = node.getContext('2d')!;

		$effect(() => {
			page.render({
				canvasContext,
				viewport: page.getViewport(viewportParams)
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
					{@const viewport = page.getViewport(viewportParams)}
					<div
						style="
							position: relative;
							width: {viewport.width}px;
							height: {viewport.height}px;
						"
					>
						<canvas
							width={viewport.width}
							height={viewport.height}
							use:render={page}
						></canvas>
						{#await page.getTextContent() then textContent}
							{#each textContent.items as item}
								{@const transform = PDFJS.Util.transform(
									viewport.transform,
									item.transform
								)}
								{@const fontSize = Math.hypot(transform[2], transform[3])}
								<span
									style="
										left: {transform[4]}px;
										top: {transform[5] - fontSize}px;
										font-size: {Math.hypot(transform[2], transform[3])}px;
										font-family: {item.fontName};
										transform: rotate({Math.atan2(transform[1], transform[0]) *
										(180 / Math.PI)}deg);
									">{item.str}</span
								>
							{/each}
						{/await}
					</div>
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
	}

	canvas {
		max-width: 100%;
		height: auto;
	}

	span {
		position: absolute;
		color: transparent;
		white-space: pre;
		transform-origin: 0 0;
	}
</style>
