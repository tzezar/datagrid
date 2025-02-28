import type { AggregationFn } from "../types";

/**
 * A set of built-in aggregation functions.
 * Each function operates on an array of values and returns a calculated result.
 * 
 * @typedef {Object} AggregationFunctions
 * @property {AggregationFn} sum - Calculates the sum of all values in the array.
 * @property {AggregationFn} min - Finds the minimum value in the array.
 * @property {AggregationFn} max - Finds the maximum value in the array.
 * @property {AggregationFn} extent - Returns an array with the minimum and maximum values.
 * @property {AggregationFn} mean - Calculates the mean (average) of the array.
 * @property {AggregationFn} median - Finds the median value in the array.
 * @property {AggregationFn} unique - Returns a list of unique values from the array.
 * @property {AggregationFn} uniqueCount - Counts the number of unique values in the array.
 * @property {AggregationFn} count - Counts the total number of elements in the array.
 */
export const aggregationFunctions: {
    [key: string]: AggregationFn;
    sum: (values: number[]) => number;
    min: (values: number[]) => number;
    max: (values: number[]) => number;
    extent: (values: number[]) => [number, number];
    mean: (values: number[]) => number;
    median: (values: number[]) => number;
    unique: (values: any[]) => any[];
    uniqueCount: (values: any[]) => number;
    count: (values: any[]) => number;
} = {
    /**
     * Calculates the sum of all values in the array.
     * @param {number[]} values - The array of numbers to sum.
     * @returns {number} The sum of the values.
     */
    sum: (values: number[]): number =>
        values.reduce((sum, val) => sum + (val || 0), 0),

    /**
     * Finds the minimum value in the array.
     * @param {number[]} values - The array of numbers to check.
     * @returns {number} The minimum value.
     */
    min: (values: number[]): number =>
        Math.min(...values),

    /**
     * Finds the maximum value in the array.
     * @param {number[]} values - The array of numbers to check.
     * @returns {number} The maximum value.
     */
    max: (values: number[]): number =>
        Math.max(...values),

    /**
     * Returns an array with the minimum and maximum values.
     * @param {number[]} values - The array of numbers to check.
     * @returns {[number, number]} The extent of values: [min, max].
     */
    extent: (values: number[]): [number, number] =>
        [Math.min(...values), Math.max(...values)],

    /**
     * Calculates the mean (average) of the array.
     * @param {number[]} values - The array of numbers to calculate the mean.
     * @returns {number} The mean of the values.
     */
    mean: (values: number[]): number => {
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    },

    /**
     * Finds the median value in the array.
     * @param {number[]} values - The array of numbers to calculate the median.
     * @returns {number} The median value.
     */
    median: (values: number[]): number => {
        if (values.length === 0) {
            return 0; // Or another appropriate default value
        }
        
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        
        if (sorted.length % 2 !== 0) {
            // For odd-length arrays
            return sorted[mid] ?? 0; // Use nullish coalescing to ensure a number
        } else {
            // For even-length arrays
            const midValue = sorted[mid] ?? 0;
            const midMinusOneValue = sorted[mid - 1] ?? 0;
            return (midMinusOneValue + midValue) / 2;
        }
    },

    /**
     * Returns a list of unique values from the array.
     * @param {any[]} values - The array of values to extract unique items from.
     * @returns {any[]} An array of unique values.
     */
    unique: (values: any[]): any[] =>
        Array.from(new Set(values)),

    /**
     * Counts the number of unique values in the array.
     * @param {any[]} values - The array of values to count unique items.
     * @returns {number} The number of unique values.
     */
    uniqueCount: (values: any[]): number =>
        new Set(values).size,

    /**
     * Counts the total number of elements in the array.
     * @param {any[]} values - The array to count.
     * @returns {number} The total number of elements in the array.
     */
    count: (values: any[]): number =>
        values.length,
};
