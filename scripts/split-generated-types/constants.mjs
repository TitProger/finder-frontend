/** Корень репо и пути артефактов split. */
import { join } from 'node:path';

export const ROOT = process.cwd();
export const OPENAPI_JSON = join(ROOT, 'contracts/openapi.bundled.json');
export const OUT_DIR = join(ROOT, 'shared/api/generated/types');

export const HTTP_METHODS = new Set([
    'get',
    'put',
    'post',
    'delete',
    'options',
    'head',
    'patch',
    'trace',
]);

export const HEADER = `/**
 * Автогенерация: scripts/split-generated-types (после contract:sync).
 * Не редактировать руками.
 */

`;
