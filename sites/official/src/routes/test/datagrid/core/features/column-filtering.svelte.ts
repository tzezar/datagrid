import type { AccessorColumn, ComputedColumn } from "../helpers/column-creators";
import type { FilterCondition, FilterOperator } from "../types";



export class Filtering<TOriginalRow> {
    conditions: FilterCondition<TOriginalRow>[] = $state([
        {
            columnId: 'role',
            operator: 'equals',
            getValueFn: (row) => row.role,
            value: 'user'
        }
    ])

    getConditionValue(columnId: string): any {
        const condition = this.conditions.find(c => c.columnId === columnId);
        return condition ? condition.value : null;
    }

    getConditionOperator(columnId: string): FilterOperator | undefined {
        const condition = this.conditions.find(c => c.columnId === columnId);
        return condition?.operator;
    }

    updateFilterCondition(props: {
        column: (AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>),
        value: any,
    }) {
        const { column, value } = props;

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
