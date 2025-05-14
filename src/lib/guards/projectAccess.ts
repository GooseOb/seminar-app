import { hasAccessToProject } from '$lib/server/queries';
import { createUserIdGuard } from './common';

export const projectAccessGuard = createUserIdGuard(
	hasAccessToProject,
	() => 'You do not have access to this project'
);
