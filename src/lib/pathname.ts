import { page } from '$app/state';
import { i18n } from './i18n';

export const isPathname =
	(predicate: (pathname: string, value: string) => boolean) => (value: string) =>
		predicate(i18n.route(page.url.pathname), value);

export const isPathnameStart = isPathname(
	(pathname, value) => value === pathname || pathname.startsWith(value + '/')
);
