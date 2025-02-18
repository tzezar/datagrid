import { faker } from '@faker-js/faker';

export type ProductCondition = 'new' | 'refurbished' | 'used';
export type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock' | 'discontinued' | 'backordered';
export type StorageLocation = 'warehouse' | 'store-front' | 'external';

export interface InventoryItem {
    id: number;
    sku: string;
    name: string;
    description: string;
    brand: string;
    category: string;
    subcategory: string;
    price: {
        retail: number;
        wholesale: number;
        msrp: number;
        currency: string;
    };
    inventory: {
        quantity: number;
        minStockLevel: number;
        maxStockLevel: number;
        location: StorageLocation;
        binNumber: string;
    };
    supplier: {
        id: string;
        name: string;
        contactPerson: string;
        email: string;
        phone: string;
        country: string;
        leadTimeInDays: number;
        minimumOrderQuantity: number;
    };
    dimensions: {
        width: number;
        height: number;
        length: number;
        weight: number;
        unit: 'metric' | 'imperial';
    };
    condition: ProductCondition;
    status: InventoryStatus;
    restockInfo: {
        nextRestockDate: Date | null;
        expectedQuantity: number | null;
        lastRestockDate: Date;
        averageMonthlyDemand: number;
    };
    metadata: {
        createdAt: Date;
        updatedAt: Date;
        isActive: boolean;
        tags: string[];
        barcode: string;
    };
}

const COMMON_CATEGORIES = {
    'Electronics': ['Smartphones', 'Laptops', 'Accessories', 'Audio', 'Gaming'],
    'Clothing': ['Men\'s Wear', 'Women\'s Wear', 'Children\'s Wear', 'Sportswear', 'Accessories'],
    'Home & Garden': ['Furniture', 'Decor', 'Kitchen', 'Garden Tools', 'Lighting'],
    'Sports': ['Equipment', 'Apparel', 'Footwear', 'Accessories', 'Nutrition'],
    'Beauty': ['Skincare', 'Makeup', 'Haircare', 'Fragrances', 'Tools']
};

function generateSKU(category: string, id: number): string {
    const prefix = category.substring(0, 3).toUpperCase();
    const randomNum = faker.number.int({ min: 1000, max: 9999 });
    return `${prefix}-${randomNum}-${id.toString().padStart(5, '0')}`;
}

function determineStatus(quantity: number, minStockLevel: number): InventoryStatus {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < minStockLevel) return 'low-stock';
    if (faker.number.int({ min: 1, max: 100 }) <= 5) return 'discontinued'; // 5% chance
    if (faker.number.int({ min: 1, max: 100 }) <= 10) return 'backordered'; // 10% chance
    return 'in-stock';
}

function generatePrice(basePrice: number) {
    const wholeSaleMargin = faker.number.float({ min: 0.5, max: 0.7, fractionDigits: 2 }); // 50-70% of retail
    const msrpMargin = faker.number.float({ min: 1.2, max: 1.5, fractionDigits: 2 }); // 120-150% of retail

    return {
        retail: Number(basePrice.toFixed(2)),
        wholesale: Number((basePrice * wholeSaleMargin).toFixed(2)),
        msrp: Number((basePrice * msrpMargin).toFixed(2)),
        currency: 'USD'
    };
}

export function generateInventoryItem(id: number): InventoryItem {
    // Select category and subcategory
    const category: keyof typeof COMMON_CATEGORIES = faker.helpers.arrayElement(Object.keys(COMMON_CATEGORIES)) as keyof typeof COMMON_CATEGORIES;
    const subcategory: string = faker.helpers.arrayElement(COMMON_CATEGORIES[category]);


    // Generate consistent inventory levels
    const maxStockLevel = faker.number.int({ min: 100, max: 1000 });
    const minStockLevel = Math.floor(maxStockLevel * 0.2); // 20% of max
    const currentQuantity = faker.number.int({ min: 0, max: maxStockLevel });

    // Generate base price based on category
    const basePrice = faker.number.float({
        min: category === 'Electronics' ? 100 : 10,
        max: category === 'Electronics' ? 2000 : 500,
        fractionDigits: 2
    });

    const status = determineStatus(currentQuantity, minStockLevel);
    const createdAt = faker.date.past({ years: 2 });

    return {
        id,
        sku: generateSKU(category, id),
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        brand: faker.company.name(),
        category,
        subcategory,
        price: generatePrice(basePrice),
        inventory: {
            quantity: currentQuantity,
            minStockLevel,
            maxStockLevel,
            location: faker.helpers.arrayElement(['warehouse', 'store-front', 'external']),
            binNumber: faker.helpers.arrayElement(['A', 'B', 'C', 'D']) + faker.number.int({ min: 1, max: 99 })
        },
        supplier: {
            id: faker.string.uuid(),
            name: faker.company.name(),
            contactPerson: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            country: faker.location.country(),
            leadTimeInDays: faker.number.int({ min: 3, max: 45 }),
            minimumOrderQuantity: faker.number.int({ min: 5, max: 100 })
        },
        dimensions: {
            width: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
            height: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
            length: faker.number.float({ min: 1, max: 100, fractionDigits: 1 }),
            weight: faker.number.float({ min: 0.1, max: 50, fractionDigits: 1 }),
            unit: faker.helpers.arrayElement(['metric', 'imperial'])
        },
        condition: faker.helpers.arrayElement(['new', 'refurbished', 'used']),
        status,
        restockInfo: {
            nextRestockDate: status === 'discontinued' ? null : faker.date.future({ years: 1 }),
            expectedQuantity: status === 'discontinued' ? null : faker.number.int({ min: 50, max: 500 }),
            lastRestockDate: faker.date.past({ years: 1 }),
            averageMonthlyDemand: faker.number.int({ min: 10, max: 200 })
        },
        metadata: {
            createdAt,
            updatedAt: faker.date.between({ from: createdAt, to: new Date() }),
            isActive: status !== 'discontinued',
            tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => faker.word.sample()),
            barcode: faker.string.numeric(13)
        }
    };
}

// Helper function to generate multiple items
export function generateInventoryItems(count: number): InventoryItem[] {
    return Array.from({ length: count }, (_, index) => generateInventoryItem(index + 1));
}