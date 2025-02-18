import { faker } from '@faker-js/faker';

// Types
type PlanetType = 'terrestrial' | 'gas giant' | 'ice giant' | 'dwarf';
type AtmosphereComposition = 'nitrogen' | 'carbon dioxide' | 'hydrogen' | 'helium' | 'methane' | 'none';
type StarType = 'main sequence' | 'red giant' | 'white dwarf' | 'neutron star' | 'black hole';

// Interfaces
interface Planet {
    id: string;
    name: string;
    type: PlanetType;
    distanceFromStar: number; // in million km
    diameter: number; // in km
    mass: number; // in Earth masses
    atmosphereComposition: AtmosphereComposition[];
    hasRings: boolean;
    numberOfMoons: number;
    averageTemperature: number; // in Celsius
    canSupportLife: boolean;
    discoveryDate: Date | null; // null for planets known since ancient times
    discoveredBy: string | null;
}

interface Star {
    id: string;
    name: string;
    type: StarType;
    age: number; // in billion years
    mass: number; // in Solar masses
    temperature: number; // in Kelvin
    luminosity: number; // relative to Sun
    numberOfPlanets: number;
    distanceFromEarth: number; // in light years
}

interface Spacecraft {
    id: string;
    name: string;
    launchDate: Date;
    missionType: 'orbital' | 'flyby' | 'landing' | 'sample return';
    status: 'pre-launch' | 'active' | 'completed' | 'failed';
    operator: string;
    destination: string;
    crew: number; // 0 for unmanned
    cost: number; // in millions USD
}

// Generators
export function generatePlanet(): Planet {
    const type = faker.helpers.arrayElement(['terrestrial', 'gas giant', 'ice giant', 'dwarf']);
    const isAncient = faker.datatype.boolean(0.3); // 30% chance of being known since ancient times

    return {
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement([
            'Kepler', 'Nova', 'Atlas', 'Titan', 'Hyperion', 'Helios', 'Osiris'
        ]) + '-' + faker.number.int({ min: 1, max: 999 }),
        type,
        distanceFromStar: faker.number.float({ min: 50, max: 4500, fractionDigits: 1 }),
        diameter: faker.number.int({ min: 2000, max: 140000 }),
        mass: faker.number.float({ min: 0.1, max: 317, fractionDigits: 2 }),
        atmosphereComposition: faker.helpers.arrayElements(
            ['nitrogen', 'carbon dioxide', 'hydrogen', 'helium', 'methane', 'none'],
            { min: 1, max: 3 }
        ),
        hasRings: faker.datatype.boolean(0.2), // 20% chance of having rings
        numberOfMoons: faker.number.int({ min: 0, max: 82 }),
        averageTemperature: faker.number.int({ min: -200, max: 400 }),
        canSupportLife: type === 'terrestrial' && faker.datatype.boolean(0.1), // 10% chance for terrestrial planets
        discoveryDate: isAncient ? null : faker.date.past({ years: 400 }),
        discoveredBy: isAncient ? null : faker.person.fullName()
    };
}

export function generateStar(): Star {
    return {
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement([
            'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'
        ]) + ' ' + faker.location.city(),
        type: faker.helpers.arrayElement([
            'main sequence', 'red giant', 'white dwarf', 'neutron star', 'black hole'
        ]),
        age: faker.number.float({ min: 0.1, max: 13.8, fractionDigits: 1 }),
        mass: faker.number.float({ min: 0.08, max: 150, fractionDigits: 2 }),
        temperature: faker.number.int({ min: 2400, max: 40000 }),
        luminosity: faker.number.float({ min: 0.0001, max: 1000000, fractionDigits: 4 }),
        numberOfPlanets: faker.number.int({ min: 0, max: 12 }),
        distanceFromEarth: faker.number.float({ min: 4.2, max: 1000, fractionDigits: 1 })
    };
}

export function generateSpacecraft(): Spacecraft {
    const launchDate = faker.date.between({ 
        from: '1957-10-04', // Sputnik 1 launch date
        to: '2030-12-31' 
    });

    return {
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement([
            'Voyager', 'Pioneer', 'Explorer', 'Pathfinder', 'Discovery'
        ]) + '-' + faker.number.int({ min: 1, max: 999 }),
        launchDate,
        missionType: faker.helpers.arrayElement([
            'orbital', 'flyby', 'landing', 'sample return'
        ]),
        status: faker.helpers.arrayElement([
            'pre-launch', 'active', 'completed', 'failed'
        ]),
        operator: faker.helpers.arrayElement([
            'NASA', 'ESA', 'Roscosmos', 'ISRO', 'JAXA', 'SpaceX'
        ]),
        destination: faker.helpers.arrayElement([
            'Moon', 'Mars', 'Venus', 'Jupiter', 'Saturn', 'Asteroid Belt'
        ]),
        crew: faker.helpers.arrayElement([0, 0, 0, 2, 3, 4]), // More weight to unmanned missions
        cost: faker.number.float({ min: 100, max: 10000, fractionDigits: 1 })
    };
}

// Helper function to generate a complete solar system
export function generateSolarSystem() {
    const star = generateStar();
    const planets = Array.from(
        { length: star.numberOfPlanets },
        generatePlanet
    );
    const missions = Array.from(
        { length: faker.number.int({ min: 1, max: 5 }) },
        generateSpacecraft
    );

    return {
        star,
        planets,
        missions
    };
}