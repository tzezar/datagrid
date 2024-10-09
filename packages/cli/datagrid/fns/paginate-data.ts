import type { Data } from "../types";

export const paginateData = <T>(
    data: Data<T>,
    page: number,
    perPage: number
): Data<T> => {
    const start = (page - 1) * perPage;
    const end = page * perPage;
    return data.slice(start, end);
};
