import { db, project } from '$lib/server/db';
import { eq, sql } from 'drizzle-orm';

const updateProjectEditableQuery = () =>
	db()
		.update(project)
		.set({
			editable: sql.placeholder('editable') as any
		})
		.where(eq(project.id, sql.placeholder('id')));

export const updateProjectEditable = async (id: number, editable: boolean) => {
	await updateProjectEditableQuery().execute({
		id,
		editable
	});
};
