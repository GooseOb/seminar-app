#!/usr/bin/env node

import { readdirSync, existsSync, readFileSync } from 'fs';
import * as path from 'path';

const COLORS = [
	'lightblue',
	'lightgreen',
	'lightyellow',
	'lightpink',
	'lightcyan',
	'orange',
	'gold',
	'violet',
	'salmon',
	'khaki'
];

const LIB_PATH = path.resolve('src/lib');

process.chdir(path.resolve(process.argv[2] || '.'));

const INCLUDE_PATTERN = /(?:routes|components)\/.+\.svelte$/;

const IGNORE_PATTERN = /(?:node_modules|dist|\.svelte-kit)\//;

const findTsFiles = (dir) =>
	readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
		const fullPath = path.join(dir, entry.name);
		return !IGNORE_PATTERN.test(fullPath)
			? entry.isDirectory()
				? findTsFiles(fullPath)
				: entry.isFile() &&
					  (fullPath.endsWith('.ts') || fullPath.endsWith('.svelte'))
					? [path.relative(process.cwd(), fullPath)]
					: []
			: [];
	});

const files = findTsFiles('.').filter((file) => INCLUDE_PATTERN.test(file));

// Assign colors to nodes based on their directory
const dirColor = new Map();
const fileColor = new Map();
let colorIndex = 0;

for (const file of files) {
	const dir = path.dirname(file);
	let color = dirColor.get(dir);
	if (!color) {
		color = COLORS[colorIndex % COLORS.length];
		dirColor.set(dir, color);
		colorIndex++;
	}
	fileColor.set(file, color);
}

// Collect imports and exports
const imports = new Map();

for (const file of files) {
	const matches = [];
	if (!existsSync(file)) continue;

	const lines = readFileSync(file, 'utf8').split('\n');
	for (const line of lines) {
		const m = line.match(/(import|export).*['"](.+)['"];/);
		if (m) {
			const imported = m[2].replace(/\$lib/, LIB_PATH);
			const dir = path.dirname(file);
			const fullImport = path.resolve(dir, imported);
			let resolved = null;
			if (existsSync(`${fullImport}.ts`)) {
				resolved = path.relative(process.cwd(), `${fullImport}.ts`);
			} else if (existsSync(path.join(fullImport, 'index.ts'))) {
				resolved = path.relative(
					process.cwd(),
					path.join(fullImport, 'index.ts')
				);
			} else if (existsSync(fullImport)) {
				resolved = path.relative(process.cwd(), fullImport);
			}

			if (resolved && INCLUDE_PATTERN.test(resolved)) matches.push(resolved);
		}
	}

	imports.set(file, matches);
}

process.stdout.write(`digraph G {
rankdir=LR;
node [shape=box, style=filled];
${Array.from(imports).reduce(
	(acc, { 0: file, 1: deps }) =>
		acc +
		`"${file}" [fillcolor=${fileColor.get(file)}];` +
		deps.reduce(
			(acc, item) =>
				IGNORE_PATTERN.test(item) ? acc : acc + `"${file}" -> "${item}";`,
			''
		),
	''
)}
}`);
