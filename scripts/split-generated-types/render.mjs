/**
 * Рендер TS-алиасов и barrel-файлов.
 */
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HEADER } from './constants.mjs';

/**
 * @param {Iterable<string>} names
 * @param {'./generated' | '../generated'} schemaImport
 */
export function renderAliases(names, schemaImport) {
    const sorted = [...names].sort();
    if (sorted.length === 0) {
        return `${HEADER}export {};\n`;
    }

    return [
        HEADER.trimEnd(),
        '',
        `import type { components } from '${schemaImport}';`,
        '',
        ...sorted.map((name) => `export type ${name} = components['schemas']['${name}'];`),
        '',
    ].join('\n');
}

export function writeBarrel(dir, files) {
    if (files.length === 0) {
        writeFileSync(join(dir, 'index.ts'), `${HEADER}export {};\n`);
        return;
    }

    const exports = files
        .sort()
        .map((file) => `export type * from './${file.replace(/\.ts$/, '')}';`)
        .join('\n');

    writeFileSync(join(dir, 'index.ts'), `${HEADER}${exports}\n`);
}
