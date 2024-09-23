import type { Filter } from "../types";
import { getNestedValue } from "./get-nested-value";

export const filterData = <T>(data: T[], filters: Filter[]): T[] => {
    return filters.reduce((filteredData, { columnId, value, type }) => {
        if (!columnId || value == null) {
            return filteredData;
        }

        return filteredData.filter(item => {
            const fieldValue = getNestedValue(item, columnId);

            switch (type) {
                case 'string':
                case 'select':
                    return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(String(value).toLowerCase());

                case 'number':
                    return typeof fieldValue === 'number' && fieldValue === Number(value);

                case 'range':
                    if (typeof fieldValue === 'number') {
                        const [min, max] = value as [number, number];
                        return fieldValue >= min && fieldValue <= max;
                    }
                    return false;

                case 'date':
                    return typeof fieldValue === 'string' && isSameDate(fieldValue, value as string);

                case 'dateRange':
                    return typeof fieldValue === 'string' && isWithinDateRange(fieldValue, value as [string, string]);

                default:
                    return false;
            }
        });
    }, data);
};

// Helper functions to handle date comparison
const isSameDate = (dateStr: string, filterDateStr: string): boolean => {
    return formatDate(dateStr) === formatDate(filterDateStr);
};

const isWithinDateRange = (dateStr: string, [startDateStr, endDateStr]: [string, string]): boolean => {
    const date = formatDate(dateStr);
    const start = formatDate(startDateStr);
    const end = formatDate(endDateStr);
    return date >= start && date <= end;
};

const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toISOString().split('T')[0];
};
