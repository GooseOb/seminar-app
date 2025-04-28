import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const files = [
		{ name: 'document.pdf', size: 44, modifiedBy: 'John Doe' },
		{ name: 'image.jpg', size: 128, modifiedBy: 'Jane Smith' },
		{ name: 'notes.txt', size: 12, modifiedBy: 'Alice Johnson' }
	];

	return { files };
};
