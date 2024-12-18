import type { AnyColumn } from "../helpers/column-creators";
import type { FilterableColumn, FilterCondition, FilterOperator } from "../types";
import { isColumnFilterable } from "../utils.svelte";



export class Filtering<TOriginalRow> {
    conditions: FilterCondition<TOriginalRow>[] = $state([])

    getConditionValue(columnId: string): any {
        const condition = this.conditions.find(c => c.columnId === columnId);
        return condition ? condition.value : null;
    }

    getConditionOperator(columnId: string): FilterOperator | undefined {
        const condition = this.conditions.find(c => c.columnId === columnId);
        return condition?.operator;
    }

    updateFilterCondition(props: {
        column: AnyColumn<TOriginalRow>,
        value: any,
    }) {
        const { value } = props;
        let column = isColumnFilterable(props.column);
        if (column === null) return;
        column = column as FilterableColumn<TOriginalRow>

        if (!column) return;
        // Find existing condition
        const conditionIndex = this.conditions.findIndex(c => c.columnId === column.columnId);

        if (value === '' || value === null || value === undefined) {
            // If value is empty, remove the condition (do not filter)
            if (conditionIndex > -1) {
                this.conditions.splice(conditionIndex, 1);
            }
            return;
        }

        if (conditionIndex === -1) {
            // If condition doesn't exist, add a new one
            this.conditions.push({
                columnId: column.columnId,
                operator: 'equals',
                getValueFn: column.getValueFn,
                value
            });
        } else {
            // Update existing condition value
            this.conditions[conditionIndex].value = value;
        }
    }
}
