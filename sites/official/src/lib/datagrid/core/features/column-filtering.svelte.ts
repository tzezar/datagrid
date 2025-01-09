import type { FilterCondition, FilterOperator } from "../types";

export class ColumnFilteringFeature<TOriginalRow> {
    conditions: FilterCondition<TOriginalRow>[] = $state([])
    showColumnFiltering: boolean = $state(false);

    // TODO move it to more appropriate place
    toggleColumnFiltering() {
        this.showColumnFiltering = !this.showColumnFiltering;
    }

    getConditionValue(columnId: string): any {
        const condition = this.conditions.find(c => c.columnId === columnId);
        return condition ? condition.value : null;
    }

    getConditionOperator(columnId: string): FilterOperator | undefined {
        const condition = this.conditions.find(c => c.columnId === columnId);
        return condition?.operator;
    }

    evaluateCondition(cellValue: any, condition: FilterCondition<TOriginalRow>): boolean {
        const value = condition.value;
        const valueTo = condition.valueTo;

        // Handle null/undefined cell values
        if (cellValue === null || cellValue === undefined) {
            return condition.operator === 'empty';
        }

        // Convert to string for string operations
        const stringCellValue = String(cellValue).toLowerCase();
        const stringValue = String(value).toLowerCase();

        switch (condition.operator) {
            case 'equals':
                return cellValue === value;

            case 'notEquals':
                return cellValue !== value;

            case 'contains':
                return stringCellValue.includes(stringValue);

            case 'notContains':
                return !stringCellValue.includes(stringValue);

            case 'startsWith':
                return stringCellValue.startsWith(stringValue);

            case 'endsWith':
                return stringCellValue.endsWith(stringValue);

            case 'greaterThan':
                return cellValue > value;

            case 'lessThan':
                return cellValue < value;

            case 'greaterThanOrEqual':
                return cellValue >= value;

            case 'lessThanOrEqual':
                return cellValue <= value;

            case 'between':
                if (valueTo === undefined) throw new Error('Between filter requires a second value');
                return cellValue >= value && cellValue <= valueTo;

            case 'inList':
                return Array.isArray(value) && value.includes(cellValue);

            case 'notInList':
                return Array.isArray(value) && !value.includes(cellValue);

            case 'empty':
                return cellValue === '' || cellValue === null || cellValue === undefined;

            case 'notEmpty':
                return cellValue !== '' && cellValue !== null && cellValue !== undefined;

            default:
                return true;
        }
    }
}
