import { pbkdf2Sync, randomBytes } from 'node:crypto';

export const hashPassword = (password: string): string => {
	const salt = randomBytes(16).toString('hex');
	const hash = pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
	return `${salt}:${hash}`;
};

export const verifyPassword = (
	storedPassword: string,
	providedPassword: string
): boolean => {
	const [salt, originalHash] = storedPassword.split(':');
	const hash = pbkdf2Sync(
		providedPassword,
		salt,
		100000,
		64,
		'sha512'
	).toString('hex');
	return hash === originalHash;
};
