import type { BaseColumn } from "../types";

export const getExportableColumns = <T>(columns: BaseColumn<T>[]) =>
    columns.filter((column) => column.exportable !== false);
