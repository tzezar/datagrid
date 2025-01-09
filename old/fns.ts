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


