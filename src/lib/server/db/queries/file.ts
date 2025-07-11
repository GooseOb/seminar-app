import { db, fileMetadata, type FileMetadata } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';
import { first } from './common';

export const insertFileMetadata = async (id: string) => {
	await db().insert(fileMetadata).values({
		id
	});
};

const getFileMetadataQuery = () =>
	db()
		.select()
		.from(fileMetadata)
		.where(eq(fileMetadata.id, sql.placeholder('id')));

export const getFileMetadata = (id: string) =>
	first(getFileMetadataQuery().execute({ id }));

export const updateFileMetadata = async (
	id: string,
	data: Partial<Omit<FileMetadata, 'id'>>
) => {
	await db().update(fileMetadata).set(data).where(eq(fileMetadata.id, id));
};
