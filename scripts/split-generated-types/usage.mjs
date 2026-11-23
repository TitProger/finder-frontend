/**
 * Сбор: схема → теги и kind (request|response) по операциям.
 */
import { HTTP_METHODS } from './constants.mjs';
import { isSharedSchema } from './classify.mjs';
import {
    collectResponseComponentRefs,
    collectSchemaRefs,
    expandNestedSchemas,
} from './refs.mjs';

/**
 * @returns {{
 *   tagsBySchema: Map<string, Set<string>>,
 *   kindsBySchema: Map<string, Set<'request' | 'response'>>,
 * }}
 */
export function collectSchemaUsage(document) {
    const schemas = document.components?.schemas ?? {};
    const responseComponents = document.components?.responses ?? {};

    /** @type {Map<string, Set<string>>} */
    const tagsBySchema = new Map();
    /** @type {Map<string, Set<'request' | 'response'>>} */
    const kindsBySchema = new Map();

    const remember = (name, tag, kind) => {
        if (!schemas[name] || isSharedSchema(name, schemas[name])) {
            return;
        }

        if (!tagsBySchema.has(name)) {
            tagsBySchema.set(name, new Set());
        }
        tagsBySchema.get(name).add(tag);

        if (!kindsBySchema.has(name)) {
            kindsBySchema.set(name, new Set());
        }
        kindsBySchema.get(name).add(kind);
    };

    for (const pathItem of Object.values(document.paths ?? {})) {
        if (!pathItem || typeof pathItem !== 'object') {
            continue;
        }

        for (const [method, operation] of Object.entries(pathItem)) {
            if (!HTTP_METHODS.has(method) || !operation || typeof operation !== 'object') {
                continue;
            }

            const tag = operation.tags?.[0] ?? 'untagged';

            const requestRefs = expandNestedSchemas(
                collectSchemaRefs(operation.requestBody),
                schemas,
            );
            for (const name of requestRefs) {
                remember(name, tag, 'request');
            }

            const responseSchemaRefs = collectSchemaRefs(operation.responses);
            for (const responseName of collectResponseComponentRefs(operation.responses)) {
                collectSchemaRefs(responseComponents[responseName], responseSchemaRefs);
            }

            const responseRefs = expandNestedSchemas(responseSchemaRefs, schemas);
            for (const name of responseRefs) {
                remember(name, tag, 'response');
            }
        }
    }

    return { tagsBySchema, kindsBySchema };
}
