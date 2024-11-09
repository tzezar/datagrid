
export const companyNames = [
    "TechSphere Solutions",
    "Innovative Dynamics",
    "Quantum Leap Technologies",
    "NextGen Innovations",
    "Blue Horizon Enterprises",
    "Vertex Global Solutions",
    "GreenLeaf Tech",
    "CyberCore Systems",
    "Visionary Minds",
    "Synergy Global Inc.",
    "FutureWave Technologies",
    "Elemental Innovations",
    "Nexus Digital Labs",
    "Pinnacle Enterprises",
    "BrightPath Solutions",
    "Vertex Data Systems",
    "Quantum Bridge Technologies",
    "SilverStream Software",
    "Skyline Ventures",
    "EcoTech Industries",
    "Apex Vision Group",
    "Global Edge Technologies",
    "CrystalClear Solutions",
    "Evergreen Tech",
    "AlphaWave Systems",
    "NewEra Innovations",
    "TechPulse Solutions",
    "Urban Dynamics",
    "TrueNorth Tech",
    "Zephyr Innovations",
    "Redstone Global",
    "Solaris Technologies",
    "CleverEdge Systems",
    "Velocity Ventures",
    "Luminary Enterprises",
    "DeepSea Solutions",
    "Eclipse Innovations",
    "Summit Tech Solutions",
    "ClearPath Enterprises",
    "BlueLine Technologies",
    "Pacific Dynamics",
    "Titan Technologies",
    "BrightFuture Solutions",
    "Everest Innovations",
    "IronClad Systems",
    "Orion Ventures",
    "GlobalReach Solutions",
    "Arcadia Technologies",
    "Hexagon Enterprises",
    "SkyBound Solutions",
    "FusionTech Systems"
];
export const clientNames = [
    'Sebastian "Tzezar" Drozd',
    'Sebastian "Tzezar" Drozd',
    'Sebastian "Tzezar" Drozd',
    'Sebastian "Tzezar" Drozd',
    'Sebastian "Tzezar" Drozd',

    "Anderson Consulting",
    "BrightStar Enterprises",
    "Carter & Co.",
    "Daniels Ventures",
    "Ellison Group",
    "Franklin Solutions",
    "Greystone Holdings",
    "Hamilton Innovations",
    "Ingram Partners",
    "Jackson Global",
    "Kensington Industries",
    "Langford Associates",
    "Morris Technologies",
    "Nelson Enterprises",
    "Oakwood Partners",
    "Patterson Group",
    "Quincy Financial",
    "Robinson Consultants",
    "Sampson Technologies",
    "Tate & Sons",
    "Upton Enterprises",
    "Vanderbilt Ventures",
    "Westbrook Innovations",
    "Xavier Holdings",
    "Yorkshire Solutions",
    "Zane Consulting",
    "Astor Enterprises",
    "Barnes & Partners",
    "Coleman Holdings",
    "Davis Group",
    "Elliot Financial",
    "Ferguson Industries",
    "Grant Enterprises",
    "Hayes Consulting",
    "Irving Technologies",
    "Johnson Partners",
    "Kingston Ventures",
    "Lancaster Solutions",
    "Montgomery Innovations",
    "Nixon Group",
    "Owens Consulting",
    "Parker Holdings",
    "Quinn Associates",
    "Reed Enterprises",
    "Stanford Consulting",
    "Taylor Technologies",
    "Underwood Group",
    "Vega Innovations",
    "Watson & Co.",
    "Young Enterprises",
    "Ziegler Technologies"
];

function getRandomDate(): string {
    const currentYear = new Date().getUTCFullYear(); // Get the current year
    const start = new Date(Date.UTC(currentYear, 0, 1)); // Start of the current year in UTC
    const end = new Date(Date.UTC(currentYear, 11, 31)); // End of the current year in UTC
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    const date = new Date(randomTime);
    // Return in YYYY-MM-DD format
    return date.toISOString().split('T')[0];
}

function getRandomStatus() {
    const statuses = ['canceled', 'draft', 'entered'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function getRandomName(names: string[] = companyNames) {
    return names[Math.floor(Math.random() * names.length)];
}
function getRandomTotal(number: number = 10000) {
    return Math.floor(Math.random() * number); // Random total between 0 and 9999
}



export function generateData(numEntries: number) {
    const data = [];
    for (let i = 1; i <= numEntries; i++) {
        let date = getRandomDate();

        data.push({
            id: i,
            title: `${date.slice(0, 7).replace(/-/g, '/')}/${Math.floor(Math.random() * 1001)}`,
            date: date,
            total: getRandomTotal(),
            netTotal: getRandomTotal(),
            tax: getRandomTotal(400),
            profit: getRandomTotal(6000),
            deliveredBy: getRandomName(companyNames),
            receiver: getRandomName(clientNames),
            status: getRandomStatus()
        } satisfies DataRow);
    }
    return data;
}

export function updateTotals(data: Array<{ id: number, date: string, total: number, status: string }>) {
    return data.map(entry => ({
        ...entry,
        total: getRandomTotal() // Generate a new random total
    }));
}

export type DataRow = {
    id: number;
    title: string,
    date: string;
    total: number;
    status: string;
    netTotal: number;
    tax: number;
    profit: number;
    deliveredBy: string;
    receiver: string;
}