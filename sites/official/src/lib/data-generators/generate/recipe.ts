import { faker } from '@faker-js/faker';


interface Recipe {
    id: string;
    name: string;
    cuisine: string;
    difficulty: 'easy' | 'medium' | 'hard';
    prepTime: number; // in minutes
    cookTime: number; // in minutes
    servings: number;
    ingredients: {
        item: string;
        amount: number;
        unit: string;
    }[];
    instructions: string[];
    nutritionInfo: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    tags: string[];
    rating: number;
    reviews: number;
}

export function generateRecipe(): Recipe {
    const prepTime = faker.number.int({ min: 5, max: 60 });
    const cookTime = faker.number.int({ min: 10, max: 120 });
    
    return {
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement([
            'Spicy', 'Creamy', 'Grilled', 'Roasted', 'Fresh', 'Homemade'
        ]) + ' ' + faker.helpers.arrayElement([
            'Pasta', 'Chicken', 'Salmon', 'Curry', 'Salad', 'Soup', 'Stew'
        ]),
        cuisine: faker.helpers.arrayElement([
            'Italian', 'Chinese', 'Mexican', 'Indian', 'French', 'Japanese', 'Mediterranean'
        ]),
        difficulty: faker.helpers.weightedArrayElement([
            { weight: 50, value: 'easy' },
            { weight: 35, value: 'medium' },
            { weight: 15, value: 'hard' }
        ]),
        prepTime,
        cookTime,
        servings: faker.number.int({ min: 2, max: 8 }),
        ingredients: Array.from(
            { length: faker.number.int({ min: 4, max: 12 }) },
            () => ({
                item: faker.helpers.arrayElement([
                    'onion', 'garlic', 'tomatoes', 'chicken', 'pasta', 'rice',
                    'olive oil', 'butter', 'cheese', 'herbs', 'spices'
                ]),
                amount: faker.number.float({ min: 0.25, max: 4, fractionDigits: 2 }),
                unit: faker.helpers.arrayElement([
                    'cups', 'tablespoons', 'teaspoons', 'pounds', 'ounces', 'pieces'
                ])
            })
        ),
        instructions: Array.from(
            { length: faker.number.int({ min: 3, max: 8 }) },
            (_, index) => `Step ${index + 1}: ${faker.lorem.sentence()}`
        ),
        nutritionInfo: {
            calories: faker.number.int({ min: 200, max: 800 }),
            protein: faker.number.int({ min: 5, max: 40 }),
            carbs: faker.number.int({ min: 10, max: 100 }),
            fat: faker.number.int({ min: 5, max: 35 })
        },
        tags: faker.helpers.arrayElements(
            ['vegetarian', 'gluten-free', 'dairy-free', 'quick', 'healthy', 'spicy'],
            { min: 1, max: 3 }
        ),
        rating: faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }),
        reviews: faker.number.int({ min: 5, max: 500 })
    };
}
