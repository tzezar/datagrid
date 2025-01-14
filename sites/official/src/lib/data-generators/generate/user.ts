
import { faker } from '@faker-js/faker';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    profile: {
        age: number;
        email: string;
        country: string;
    };
    stats: {
        visits: number;
        lastLogin: Date;
        averageSessionDuration: number; // in minutes
    };
    status: 'active' | 'inactive' | 'pending';
    role: 'admin' | 'user' | 'guest';
}



export function generateUser(id: number): User {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        id,
        firstName,
        lastName,
        profile: {
            age: faker.number.int({ min: 18, max: 80 }),
            email: faker.internet.email({ firstName, lastName }),
            country: faker.location.country()
        },
        stats: {
            visits: faker.number.int({ min: 1, max: 1000 }),
            lastLogin: faker.date.past({ years: 1 }),
            averageSessionDuration: faker.number.float({ min: 1, max: 120, multipleOf: 0.1 })
        },
        status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
        role: faker.helpers.arrayElement(['admin', 'user', 'guest'])
    };
}