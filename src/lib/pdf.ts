export const loadPDF = (container: HTMLDivElement, url: string) =>
	import('pdfjs-dist').then(async (PDFJS) => {
		PDFJS.GlobalWorkerOptions.workerSrc ||= (
			await import('pdfjs-dist/build/pdf.worker.min.mjs?url')
		).default;

		const pdf = await PDFJS.getDocument(url).promise;

		for (let i = 1; i <= pdf.numPages; i++) {
			const page = await pdf.getPage(i);
			const viewport = page.getViewport({ scale: 1.5 });

			const canvas = document.createElement('canvas');
			canvas.width = viewport.width;
			canvas.height = viewport.height;

			container.appendChild(canvas);

			await page.render({ canvasContext: canvas.getContext('2d')!, viewport })
				.promise;
		}
	});
