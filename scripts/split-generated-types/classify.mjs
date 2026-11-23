/**
 * Правила: куда класть схему (enums / common / requests|responses по tag).
 */

export function isPureEnum(schema) {
    return Boolean(schema && typeof schema === 'object' && Array.isArray(schema.enum));
}

/** Envelope и пагинация — всегда common (в т.ч. ApiStatus). */
export function isEnvelope(name) {
    return name === 'ApiError' || /^(Api|Page)/.test(name);
}

/** Доменные enum из контракта (кроме Api* / Page*). */

export function isDomainEnum(name, schema) {
    return isPureEnum(schema) && !isEnvelope(name);
}

export function isRequestName(name) {
    return /Request$|Query$|Params$|Body$/.test(name);
}

export function safeTagFileName(tag) {
    const normalized = String(tag)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    return normalized || 'untagged';
}

/**
 * Схема не участвует в раскладке по тегам (enums / envelope).
 */
export function isSharedSchema(name, schema) {
    return isEnvelope(name) || isDomainEnum(name, schema);
}

/**
 * @returns {{
 *   enums: Set<string>,
 *   common: Set<string>,
 *   requestsByTag: Map<string, Set<string>>,
 *   responsesByTag: Map<string, Set<string>>,
 * }}
 */
export function classifySchemas({ schemaNames, schemas, tagsBySchema, kindsBySchema }) {
    const enums = new Set();
    const common = new Set();
    /** @type {Map<string, Set<string>>} */
    const requestsByTag = new Map();
    /** @type {Map<string, Set<string>>} */
    const responsesByTag = new Map();

    const addToTagMap = (map, tag, name) => {
        const key = safeTagFileName(tag);
        if (!map.has(key)) {
            map.set(key, new Set());
        }
        map.get(key).add(name);
    };

    for (const name of schemaNames) {
        const schema = schemas[name];

        if (isDomainEnum(name, schema)) {
            enums.add(name);
            continue;
        }

        if (isEnvelope(name)) {
            common.add(name);
            continue;
        }

        const tags = tagsBySchema.get(name);
        if (!tags || tags.size !== 1) {
            common.add(name);
            continue;
        }

        const [tag] = tags;
        const kinds = kindsBySchema.get(name) ?? new Set();

        if (isRequestName(name) || (kinds.has('request') && !kinds.has('response'))) {
            addToTagMap(requestsByTag, tag, name);
            continue;
        }

        addToTagMap(responsesByTag, tag, name);
    }

    return { enums, common, requestsByTag, responsesByTag };
}
