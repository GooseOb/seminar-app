import { page } from '$app/state';
import { i18n } from './i18n';

export const getPathname = () => i18n.route(page.url.pathname + page.url.search);

export const getIsPathname =
	(predicate: (pathname: string, value: string) => boolean) => (value: string) =>
		predicate(getPathname(), value);

export const isPathnameStart = getIsPathname(
	(pathname, value) => value === pathname || pathname.startsWith(value + '/')
);

export const isLoginPage = () => isPathnameStart('/login') || isPathnameStart('/register');
