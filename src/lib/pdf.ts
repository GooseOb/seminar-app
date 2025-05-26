import type { TextItem } from 'pdfjs-dist/types/src/display/api';

export const loadPDF = (container: HTMLDivElement, url: string) =>
	import('pdfjs-dist').then(async (PDFJS) => {
		PDFJS.GlobalWorkerOptions.workerSrc ||= (
			await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
		).default;

		const pdf = await PDFJS.getDocument(url).promise;

		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const scale = 1.5;
			const viewport = page.getViewport({ scale });

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

				const angle = Math.atan2(transform[1], transform[0]) * (180 / Math.PI);
				if (angle !== 0) {
					textDiv.style.transform = `rotate(${angle}deg)`;
				}

				pageContainer.appendChild(textDiv);
			}
		}
	});
