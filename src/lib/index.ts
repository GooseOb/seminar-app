// place files you want to import through the `$lib` alias in this folder.
export type FileItem = {
	name: string;
	size: number;
	type: string;
	uploaded: Date;
	uploader?: string;
	isUploading?: boolean;
};
