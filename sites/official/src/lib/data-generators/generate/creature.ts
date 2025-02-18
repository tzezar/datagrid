import { faker } from '@faker-js/faker';

// Pokemon-style creature generator
interface Creature {
    id: string;
    name: string;
    type: ('fire' | 'water' | 'earth' | 'air' | 'electric' | 'dark' | 'light')[];
    stats: {
        health: number;
        attack: number;
        defense: number;
        speed: number;
    };
    abilities: string[];
    height: number; // in meters
    weight: number; // in kg
    habitat: string;
    rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
    evolutionStage: number;
    canEvolve: boolean;
}

export function generateCreature(): Creature {
    const types: ('fire' | 'water' | 'earth' | 'air' | 'electric' | 'dark' | 'light')[] = ['fire', 'water', 'earth', 'air', 'electric', 'dark', 'light'];
    const habitats = ['forest', 'mountain', 'ocean', 'desert', 'tundra', 'volcano', 'cave'];
    const abilityPrefixes = ['super', 'mega', 'ultra', 'hyper', 'shadow', 'crystal', 'ancient'];
    const abilityActions = ['strike', 'blast', 'shield', 'heal', 'wave', 'beam', 'storm'];

    return {
        id: faker.string.uuid(),
        name: faker.word.sample() + faker.word.sample(),
        type: faker.helpers.arrayElements(types, { min: 1, max: 2 }) as ('fire' | 'water' | 'earth' | 'air' | 'electric' | 'dark' | 'light')[],
        stats: {
            health: faker.number.int({ min: 50, max: 200 }),
            attack: faker.number.int({ min: 30, max: 150 }),
            defense: faker.number.int({ min: 20, max: 120 }),
            speed: faker.number.int({ min: 40, max: 160 })
        },
        abilities: Array.from(
            { length: faker.number.int({ min: 2, max: 4 }) },
            () => faker.helpers.arrayElement(abilityPrefixes) +
                ' ' +
                faker.helpers.arrayElement(abilityActions)
        ),
        height: faker.number.float({ min: 0.3, max: 20, fractionDigits: 1 }),
        weight: faker.number.float({ min: 1, max: 1000, fractionDigits: 1 }),
        habitat: faker.helpers.arrayElement(habitats),
        rarity: faker.helpers.weightedArrayElement([
            { weight: 50, value: 'common' },
            { weight: 30, value: 'uncommon' },
            { weight: 15, value: 'rare' },
            { weight: 5, value: 'legendary' }
        ]),
        evolutionStage: faker.number.int({ min: 1, max: 3 }),
        canEvolve: faker.datatype.boolean(0.7) // 70% chance of being able to evolve
    };
}
