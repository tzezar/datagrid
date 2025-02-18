import type { SelectionRange, BaseColumn } from "../../types";

export const copyToClipboardSelectedCells = <T>({
    data,
    selectionRange,
    columns
}: {
    data: T[],
    selectionRange: SelectionRange,
    columns: BaseColumn<T>[],
}) => {
    // Initialize rows as an array of strings for copying to clipboard
    const rows: string[][] = Array.from({ length: data.length }, () => []);

    selectionRange.forEach((cell) => {
        const [row, col] = cell.split('-').map(Number);
        // Safely access the value using the column id as the key, assuming `data[row]` is an object
        const cellValue = (data[row] as Record<string, unknown>)[columns[col].id as string];
        rows[row].push(cellValue !== undefined ? String(cellValue) : '');
    });

    const textToCopy = rows.map((row) => row.join('\t')).join('\n');

    navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
            // console.log('Copied to clipboard');
        })
        .catch((err) => {
            console.error('Failed to copy: ', err);
        });
}
