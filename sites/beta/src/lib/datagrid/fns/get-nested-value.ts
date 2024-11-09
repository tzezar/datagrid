import type { ColumnId } from "../types";

/**
 * Retrieves a nested value from an object using a dot-separated path.
 *
 * @param obj - The object from which to retrieve the value.
 * @param path - A dot-separated string representing the path to the nested value.
 * @returns The nested value, or undefined if the path is invalid.
 */
export function getNestedValue<T>(obj: T, path: ColumnId): T | undefined {
    return path.split('.').reduce<T | undefined>((acc, key) => {
        if (acc !== undefined && acc !== null && typeof acc === 'object' && key in acc) {
            return (acc as Record<string, unknown>)[key] as T; // Type assertion for better type safety
        }
        return undefined; // Return undefined if the path is invalid
    }, obj as T | undefined); // Initialize with obj cast to T | undefined
}
