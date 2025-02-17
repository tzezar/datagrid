import { faker } from '@faker-js/faker';

interface VideoGame {
    id: string;
    title: string;
    genre: string[];
    platform: string[];
    developer: string;
    publisher: string;
    releaseDate: Date;
    price: number;
    ageRating: 'E' | 'E10+' | 'T' | 'M' | 'AO';
    features: string[];
    playerCount: {
        min: number;
        max: number;
        onlineSupport: boolean;
    };
    technicalSpecs: {
        engineName: string;
        diskSpace: number; // in GB
        minimumRAM: number; // in GB
        hasRayTracing: boolean;
        supportedResolutions: string[];
    };
    metacriticScore: number | null;
    userScore: number;
    dlcCount: number;
}

export function generateVideoGame(): VideoGame {
    const hasBeenReleased = faker.datatype.boolean(0.8); // 80% chance of being released
    const releaseDate = hasBeenReleased
        ? faker.date.past({ years: 5 })
        : faker.date.future({ years: 2 });

    return {
        id: faker.string.uuid(),
        title: faker.helpers.arrayElement([
            'Dark', 'Lost', 'Epic', 'Eternal', 'Super', 'Cyber', 'Crystal'
        ]) + ' ' + faker.helpers.arrayElement([
            'Legend', 'Warriors', 'Quest', 'Fantasy', 'Adventures', 'Galaxy', 'Dreams'
        ]),
        genre: faker.helpers.arrayElements(
            ['RPG', 'Action', 'Adventure', 'Strategy', 'Simulation', 'Sports', 'FPS'],
            { min: 1, max: 3 }
        ),
        platform: faker.helpers.arrayElements(
            ['PC', 'PS5', 'Xbox Series X', 'Nintendo Switch', 'Mobile'],
            { min: 1, max: 4 }
        ),
        developer: faker.company.name(),
        publisher: faker.company.name(),
        releaseDate,
        price: faker.helpers.arrayElement([19.99, 29.99, 39.99, 49.99, 59.99, 69.99]),
        ageRating: faker.helpers.arrayElement(['E', 'E10+', 'T', 'M', 'AO']),
        features: faker.helpers.arrayElements([
            'Open World', 'Multiplayer', 'Ray Tracing', 'HDR Support',
            'Cloud Saves', 'Achievement System', 'Mod Support', 'VR Support'
        ], { min: 2, max: 5 }),
        playerCount: {
            min: faker.helpers.arrayElement([1, 2]),
            max: faker.helpers.arrayElement([1, 2, 4, 8, 16, 100]),
            onlineSupport: faker.datatype.boolean(0.7)
        },
        technicalSpecs: {
            engineName: faker.helpers.arrayElement([
                'Unreal Engine', 'Unity', 'Frostbite', 'REDengine', 'Custom Engine'
            ]),
            diskSpace: faker.helpers.arrayElement([20, 50, 80, 100, 150, 200]),
            minimumRAM: faker.helpers.arrayElement([4, 8, 12, 16]),
            hasRayTracing: faker.datatype.boolean(0.3),
            supportedResolutions: faker.helpers.arrayElements([
                '1080p', '1440p', '4K', '8K'
            ], { min: 1, max: 4 })
        },
        metacriticScore: hasBeenReleased ? faker.number.int({ min: 60, max: 100 }) : null,
        userScore: hasBeenReleased ? faker.number.float({ min: 1, max: 10, fractionDigits: 1 }) : 0,
        dlcCount: hasBeenReleased ? faker.number.int({ min: 0, max: 5 }) : 0
    };
}
