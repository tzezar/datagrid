import type { Data } from "../types";

/**
 * Paginates an array of data.
 *
 * @param data - The array of data to paginate.
 * @param page - The current page number (1-based).
 * @param perPage - The number of items per page.
 * @returns A sliced array of data representing the current page.
 */
export const paginateData = <T>(
    data: Data<T>,
    page: number,
    perPage: number
): Data<T> => {
    // Validate page and perPage values
    if (page < 1 || perPage < 1) {
        throw new Error("Page and items per page must be greater than 0.");
    }

    const start = (page - 1) * perPage;
    const end = page * perPage;

    // Return the sliced array, ensuring it doesn't exceed the bounds
    return data.slice(start, end);
};
