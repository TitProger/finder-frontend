/**
 * Раскладывает components.schemas (bundled openapi.json) в алиасы поверх schema.ts.
 *
 *   generated/enums.ts            — доменные enum (кроме Api* / Page*)
 *   generated/common.ts           — envelope, схемы на 0/2+ тега
 *   generated/requests/{tag}.ts   — тела запросов по OpenAPI tag
 *   generated/responses/{tag}.ts  — payload ответов по tag
 */
import { readFileSync } from 'node:fs';
import { classifySchemas } from './classify.mjs';
import { OPENAPI_JSON } from './constants.mjs';
import { collectSchemaUsage } from './usage.mjs';
import { writeGeneratedSplit } from './write.mjs';

export function splitGeneratedTypes() {
    const document = JSON.parse(readFileSync(OPENAPI_JSON, 'utf8'));
    const schemas = document.components?.schemas ?? {};
    const schemaNames = Object.keys(schemas);

    const { tagsBySchema, kindsBySchema } = collectSchemaUsage(document);
    const buckets = classifySchemas({
        schemaNames,
        schemas,
        tagsBySchema,
        kindsBySchema,
    });

    writeGeneratedSplit(buckets);
}
