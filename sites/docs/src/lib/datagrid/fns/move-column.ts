import type { BaseColumn } from "../types";
import { applyOffset } from "./apply-offset";

export function moveColumn<T>(index: number, direction: number, columns: BaseColumn<T>[]) {
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < columns.length) {
        [columns[index], columns[newIndex]] = [columns[newIndex], columns[index]];
    }
    applyOffset(columns);
    return columns
}