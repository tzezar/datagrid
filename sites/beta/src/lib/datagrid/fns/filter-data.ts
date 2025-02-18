import type { Filter } from "../types";
import { getNestedValue } from "./get-nested-value";

/**
 * Filters the provided data array based on the specified filters.
 *
 * @param {T[]} data - The array of data objects to be filtered.
 * @param {Filter[]} filters - The array of filter criteria.
 * @returns {T[]} - The filtered array of data objects.
 */
export const filterData = <T>(data: T[], filters: Filter[]): T[] => {
    return filters.reduce((filteredData, { columnId, value, type }) => {
        // Skip filtering if columnId or value is invalid
        if (!columnId || value == null) {
            return filteredData;
        }

        // Filter the current data set based on the filter criteria
        return filteredData.filter(item => {
            const fieldValue = getNestedValue(item, columnId);

            switch (type) {
                case 'string':
                case 'select':
                    return isStringMatch(fieldValue, value);

                case 'number':
                    return isNumberMatch(fieldValue, value);

                case 'range':
                    return isInRange(fieldValue, value as [number, number]);

                case 'date':
                    return isDateMatch(fieldValue, value as string);

                case 'dateRange':
                    return isInDateRange(fieldValue, value as [string, string]);

                default:
                    return false; // Ignore unsupported filter types
            }
        });
    }, data);
};

/**
 * Helper function to check if a string value matches the filter value (case insensitive).
 */
const isStringMatch = (fieldValue: unknown, filterValue: unknown): boolean => {
    return typeof fieldValue === 'string' && 
           fieldValue.toLowerCase().includes(String(filterValue).toLowerCase());
};

/**
 * Helper function to check if a number value matches the filter value.
 */
const isNumberMatch = (fieldValue: unknown, filterValue: unknown): boolean => {
    return typeof fieldValue === 'number' && fieldValue === Number(filterValue);
};

/**
 * Helper function to check if a number is within a specified range.
 */
const isInRange = (fieldValue: unknown, range: [number, number]): boolean => {
    if (typeof fieldValue === 'number') {
        const [min, max] = range;
        return fieldValue >= min && fieldValue <= max;
    }
    return false;
};

/**
 * Helper function to check if two date strings are the same.
 */
const isDateMatch = (dateStr: unknown, filterDateStr: string): boolean => {
    return typeof dateStr === 'string' && 
           formatDate(dateStr) === formatDate(filterDateStr);
};

/**
 * Helper function to check if a date string is within a specified date range.
 */
const isInDateRange = (dateStr: unknown, dateRange: [string, string]): boolean => {
    if (typeof dateStr === 'string') {
        const [startDateStr, endDateStr] = dateRange;
        const date = formatDate(dateStr);
        return date >= formatDate(startDateStr) && date <= formatDate(endDateStr);
    }
    return false;
};

/**
 * Formats a date string to a standard YYYY-MM-DD format.
 */
const formatDate = (dateStr: string): string => {
    return new Date(dateStr).toISOString().split('T')[0];
};
