<script lang="ts">
	import { browser } from '$app/environment';
	import type { TextItem } from 'pdfjs-dist/types/src/display/api';

	let {
		src,
		scale,
		loading = $bindable()
	}: {
		src: string;
		scale: number;
		loading: boolean;
	} = $props();

	let PDFJS: typeof import('pdfjs-dist') = $state(null)!;
	let container: HTMLDivElement = $state(null)!;

	if (browser) {
		Promise.all([
			import('pdfjs-dist'),
			import('pdfjs-dist/build/pdf.worker.min.mjs?url')
		]).then(([pdfjs, worker]) => {
			pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
			PDFJS = pdfjs;
		});

		const pages = $derived(
			PDFJS
				? PDFJS.getDocument(src).promise.then((pdf) =>
						Promise.all(
							Array.from({ length: pdf.numPages }, (_, i) => pdf.getPage(i + 1))
						)
					)
				: Promise.resolve(null)
		);

		$effect(() => {
			const viewportParams = {
				scale
			};
			pages.then(async (pages) => {
				if (!pages) return;

				container.textContent = '';

				for (const page of pages) {
					const viewport = page.getViewport(viewportParams);

					const pageContainer = document.createElement('div');
					pageContainer.style.position = 'relative';
					pageContainer.style.width = `${viewport.width}px`;
					pageContainer.style.height = `${viewport.height}px`;

					const canvas = document.createElement('canvas');
					const context = canvas.getContext('2d')!;
					canvas.width = viewport.width;
					canvas.height = viewport.height;

					pageContainer.appendChild(canvas);
					container.appendChild(pageContainer);

					await page.render({ canvasContext: context, viewport }).promise;

					const textContent = await page.getTextContent();

					for (const item of textContent.items) {
						const textItem = item as TextItem;

						const transform = PDFJS.Util.transform(
							viewport.transform,
							textItem.transform
						);

						const fontSize = Math.hypot(transform[2], transform[3]);
						const left = transform[4];
						const top = transform[5] - fontSize;

						const textDiv = document.createElement('span');

						textDiv.textContent = textItem.str;

						textDiv.style.left = `${left}px`;
						textDiv.style.top = `${top}px`;
						textDiv.style.fontSize = `${fontSize}px`;
						textDiv.style.fontFamily = textItem.fontName;

						const angle =
							Math.atan2(transform[1], transform[0]) * (180 / Math.PI);
						if (angle !== 0) {
							textDiv.style.transform = `rotate(${angle}deg)`;
						}

						pageContainer.appendChild(textDiv);
					}
				}
				loading = false;
			});
		});
	}
</script>

{#if PDFJS}
	<div bind:this={container}></div>
{:else}
	<p>Loading...</p>
{/if}

<style>
	div {
		flex: 1;
		overflow-y: auto;
		background: var(--bg4-color);
		:global(canvas) {
			max-width: 100%;
			height: auto;
		}
		:global(span) {
			position: absolute;
			color: transparent;
			white-space: pre;
			transform-origin: 0 0;
		}
	}
</style>
