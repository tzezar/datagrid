import type { ColumnId } from "../types";

// todo fix types
export function getNestedValue(obj: unknown, path: ColumnId): unknown {
    return path.split('.').reduce((acc: any, key: string) => {
        return acc && typeof acc === 'object' && key in acc ? acc[key] : undefined;
    }, obj);
}