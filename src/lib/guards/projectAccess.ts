import { hasAccessToProject } from '$lib/server/queries';
import { createUserIdGuard } from './common';
import * as m from '$lib/paraglide/messages';

export const projectAccessGuard = createUserIdGuard(
	hasAccessToProject,
	m.noAccessToProject
);
