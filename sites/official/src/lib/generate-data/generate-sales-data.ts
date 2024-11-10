
export type SalesDataRow = {
    id: number;
    department: {
        name: string;
    };
    region: string;
    sales: number;
    profit: number;
};

export async function generateSalesData(count: number, onProgress: (progress: number) => void): Promise<SalesDataRow[]> {
  const data: SalesDataRow[] = [];
  const departments = ['Sales', 'Marketing', 'Engineering', 'HR', 'Finance'];
  const regions = ['North', 'South', 'East', 'West', 'Central'];

  const batchSize = 10_000;
  for (let i = 0; i < count; i += batchSize) {
    const currentBatchSize = Math.min(batchSize, count - i);

    const batch = Array.from({ length: currentBatchSize }, (_, j) => ({
      id: i + j + 1,
      department: {
        name: departments[Math.floor(Math.random() * departments.length)]
      },
      region: regions[Math.floor(Math.random() * regions.length)],
      sales: parseFloat((Math.random() * 10000).toFixed(2)),
      profit: parseFloat((Math.random() * 5000 - 2500).toFixed(2))
    }));

    data.push(...batch);

    // Calculate progress and pass it to the callback
    const progress = Math.min(100, Math.round(((i + currentBatchSize) / count) * 100));
    onProgress(progress);

    // Delay to mimic asynchronous batch processing
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  return data;
}