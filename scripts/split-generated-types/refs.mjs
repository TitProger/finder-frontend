/**
 * Обход OpenAPI-узлов: сбор $ref на schemas / responses.
 */

export function collectSchemaRefs(node, out = new Set()) {
    if (!node || typeof node !== 'object') {
        return out;
    }

    if (Array.isArray(node)) {
        for (const item of node) {
            collectSchemaRefs(item, out);
        }
        return out;
    }

    if (typeof node.$ref === 'string') {
        const match = node.$ref.match(/#\/components\/schemas\/([^/#]+)$/);
        if (match) {
            out.add(match[1]);
        }
    }

    for (const value of Object.values(node)) {
        collectSchemaRefs(value, out);
    }

    return out;
}

export function collectResponseComponentRefs(node, out = new Set()) {
    if (!node || typeof node !== 'object') {
        return out;
    }

    if (Array.isArray(node)) {
        for (const item of node) {
            collectResponseComponentRefs(item, out);
        }
        return out;
    }

    if (typeof node.$ref === 'string') {
        const match = node.$ref.match(/#\/components\/responses\/([^/#]+)$/);
        if (match) {
            out.add(match[1]);
        }
    }

    for (const value of Object.values(node)) {
        collectResponseComponentRefs(value, out);
    }

    return out;
}

export function expandNestedSchemas(names, schemas) {
    const result = new Set(names);
    const queue = [...names];

    while (queue.length > 0) {
        const name = queue.pop();
        const schema = schemas[name];
        if (!schema) {
            continue;
        }

        for (const nested of collectSchemaRefs(schema)) {
            if (!result.has(nested)) {
                result.add(nested);
                queue.push(nested);
            }
        }
    }

    return result;
}
