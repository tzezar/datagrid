import type { AggregationFn } from "../types";

// Built-in aggregation functions
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
    sum: (values: number[]): number =>
        values.reduce((sum, val) => sum + (val || 0), 0),

    min: (values: number[]): number =>
        Math.min(...values),

    max: (values: number[]): number =>
        Math.max(...values),

    extent: (values: number[]): [number, number] =>
        [Math.min(...values), Math.max(...values)],

    mean: (values: number[]): number => {
        const sum = values.reduce((acc, val) => acc + val, 0);
        return sum / values.length;
    },

    median: (values: number[]): number => {
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0
            ? sorted[mid]
            : (sorted[mid - 1] + sorted[mid]) / 2;
    },

    unique: (values: any[]): any[] =>
        Array.from(new Set(values)),

    uniqueCount: (values: any[]): number =>
        new Set(values).size,

    count: (values: any[]): number =>
        values.length,
};

