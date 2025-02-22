
import { faker } from '@faker-js/faker';

export interface SimpleUser {
    id: number;
    firstName: string;
    lastName: string;

    age: number;
    email: string;
    country: string;

}



export function generateSimpleUser(id: number): SimpleUser {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    return {
        id,
        firstName,
        lastName,
        age: faker.number.int({ min: 18, max: 80 }),
        email: faker.internet.email({ firstName, lastName }),
        country: faker.location.country()
    };
}