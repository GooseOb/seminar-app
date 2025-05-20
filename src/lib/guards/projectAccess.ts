import { createUserIdGuard } from './common';
import * as m from '$lib/paraglide/messages';
import { hasAccessToProject } from '$lib/server/db/queries/project/access';

export const projectAccessGuard = createUserIdGuard(
	hasAccessToProject,
	m.noAccessToProject
);
