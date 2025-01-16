import { faker } from '@faker-js/faker';

export interface InventoryItem {
    id: number;
    name: string;
    category: string;
    price: number; // in USD
    quantity: number;
    supplier: {
        name: string;
        country: string;
        email: string;
    };
    restockDate: Date | null; // null if no restock planned
    status: 'in-stock' | 'out-of-stock' | 'discontinued';
}

export function generateInventoryItem(id: number): InventoryItem {
    const name = faker.commerce.productName();
    const supplierName = faker.company.name();

    return {
        id,
        name,
        category: faker.commerce.department(),
        price: faker.number.float({ min: 1, max: 5000, fractionDigits: 2 }),
        quantity: faker.number.int({ min: 0, max: 1000 }),
        supplier: {
            name: supplierName,
            country: faker.location.country(),
            email: faker.internet.email({ firstName: supplierName.split(" ")[0] }),
        },
        restockDate: faker.helpers.arrayElement([faker.date.future({ years: 1 }), null]),
        status: faker.helpers.arrayElement(['in-stock', 'out-of-stock', 'discontinued']),
    };
}
