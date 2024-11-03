export type DataItem = {
    id: number,
    department: string,
    region: string,
    sales: number,
    profit: number
}

export function generateData(count: number): DataItem[] {
    const departments = ["Sales", "Marketing", "Engineering", "HR", "Finance"];
    const regions = ["North", "South", "East", "West", "Central"];

    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        department: departments[Math.floor(Math.random() * departments.length)],
        region: regions[Math.floor(Math.random() * regions.length)],
        sales: parseFloat((Math.random() * 10000).toFixed(2)), // random sales between 0 and 10,000
        profit: parseFloat((Math.random() * 5000 - 2500).toFixed(2)), // random profit between -2,500 and 2,500
    }));
}

export const generatedData = generateData(1_000_000);

