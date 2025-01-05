// Simple performance monitoring
export class PerformanceMetrics {
    private metrics: Record<string, number> = {};

    measure(name: string, operation: () => void) {
        const start = performance.now();
        operation();
        this.metrics[name] = performance.now() - start;
    }

    print() {
        console.log('\nPerformance Summary:');
        Object.entries(this.metrics).forEach(([label, value]) =>
            console.log(`${value.toFixed(2)}ms - ${label}`));
        console.log(`Total: ${this.getTotal()}ms`);
    }

    private getTotal() {
        return Number(Object.values(this.metrics)
            .reduce((sum, value) => sum + value, 0)
            .toFixed(2));
    }

    clear() {
        this.metrics = {};
    }
}