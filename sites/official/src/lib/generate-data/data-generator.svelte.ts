import { generateSalesData, type SalesDataRow } from "./generate-sales-data";

export class DataGenerator {
  data: SalesDataRow[] = []
  progress = $state(0)
  isLoading = $state(false)
  error = $state('')
  rowCount = $state(100_000)

  fn = generateSalesData

  constructor(fn: (count: number, progress: (p: number) => void) => Promise<any[]>) { 
    this.fn = fn
  }

  async generate() {
    const count = Number(this.rowCount);
    if (isNaN(count) || count <= 0 || count > 10_000_000) {
      this.error = 'Please enter a number between 1 and 10,000,000';
      return;
    }

    this.isLoading = true;
    this.progress = 0;
    this.error = '';

    try {
      const generatedData = await this.fn(count, (p) => (this.progress = p));
      this.data.splice(0, this.data.length, ...generatedData); // Directly modify the array
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      this.error = 'Error generating data. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }
}


export async function handleGenerate(
  rowCount: number,
  data: SalesDataRow[],
  progress: { value: number },
  isLoading: { value: boolean },
  error: { value: string }
): Promise<void> {
  const count = Number(rowCount);
  if (isNaN(count) || count <= 0 || count > 10_000_000) {
    error.value = 'Please enter a number between 1 and 10,000,000';
    return;
  }

  isLoading.value = true;
  progress.value = 0;
  error.value = '';

  try {
    const generatedData = await generateSalesData(count, (p) => (progress.value = p));
    data.splice(0, data.length, ...generatedData); // Directly modify the array
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    error.value = 'Error generating data. Please try again.';
  } finally {
    isLoading.value = false;
  }
}