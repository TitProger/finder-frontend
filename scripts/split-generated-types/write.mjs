/**
 * Очистка старых артефактов и запись generated/.
 */
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { HEADER, OUT_DIR } from './constants.mjs';
import { renderAliases, writeBarrel } from './render.mjs';

function countMapValues(map) {
    return [...map.values()].reduce((sum, set) => sum + set.size, 0);
}

export function clearGeneratedSplitArtifacts() {
    for (const legacy of ['requests.ts', 'responses.ts']) {
        const path = join(OUT_DIR, legacy);
        if (existsSync(path)) {
            rmSync(path);
        }
    }

    for (const dir of ['requests', 'responses']) {
        const path = join(OUT_DIR, dir);
        if (existsSync(path)) {
            rmSync(path, { recursive: true, force: true });
        }
    }
}

/**
 * @param {{
 *   enums: Set<string>,
 *   common: Set<string>,
 *   requestsByTag: Map<string, Set<string>>,
 *   responsesByTag: Map<string, Set<string>>,
 * }} buckets
 */
export function writeGeneratedSplit(buckets) {
    const { enums, common, requestsByTag, responsesByTag } = buckets;

    mkdirSync(OUT_DIR, { recursive: true });
    clearGeneratedSplitArtifacts();

    writeFileSync(join(OUT_DIR, 'enums.ts'), renderAliases(enums, './generated'));
    writeFileSync(join(OUT_DIR, 'common.ts'), renderAliases(common, './generated'));

    const requestsDir = join(OUT_DIR, 'requests');
    const responsesDir = join(OUT_DIR, 'responses');
    mkdirSync(requestsDir, { recursive: true });
    mkdirSync(responsesDir, { recursive: true });

    const requestFiles = [];
    for (const [tag, names] of [...requestsByTag.entries()].sort(([a], [b]) => a.localeCompare(b))) {
        const fileName = `${tag}.ts`;
        writeFileSync(join(requestsDir, fileName), renderAliases(names, '../generated'));
        requestFiles.push(fileName);
    }

    const responseFiles = [];
    for (const [tag, names] of [...responsesByTag.entries()].sort(([a], [b]) => a.localeCompare(b))) {
        const fileName = `${tag}.ts`;
        writeFileSync(join(responsesDir, fileName), renderAliases(names, '../generated'));
        responseFiles.push(fileName);
    }

    writeBarrel(requestsDir, requestFiles);
    writeBarrel(responsesDir, responseFiles);

    writeFileSync(
        join(OUT_DIR, 'index.ts'),
        `${HEADER}export type * from './generated';
export type * from './enums';
export type * from './common';
export type * from './requests';
export type * from './responses';
`,
    );

    console.log(
        `→ split types: enums=${enums.size}, common=${common.size}, ` +
            `requests=${countMapValues(requestsByTag)} (${requestFiles.length} файлов), ` +
            `responses=${countMapValues(responsesByTag)} (${responseFiles.length} файлов)`,
    );

    if (requestFiles.length) {
        console.log(`  requests: ${requestFiles.map((f) => f.replace(/\.ts$/, '')).join(', ')}`);
    }
    if (responseFiles.length) {
        console.log(`  responses: ${responseFiles.map((f) => f.replace(/\.ts$/, '')).join(', ')}`);
    }
}
