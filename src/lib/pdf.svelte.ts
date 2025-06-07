import { browser } from '$app/environment';

if (browser) {
	Promise.all([
		import('pdfjs-dist'),
		import('pdfjs-dist/build/pdf.worker.min.mjs?url')
	]).then(([lib, worker]) => {
		lib.GlobalWorkerOptions.workerSrc = worker.default;
		val = lib;
	});
}

let val: typeof import('pdfjs-dist') = $state(null)!;

export const PDFJS = () => val;
