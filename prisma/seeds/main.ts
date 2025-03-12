import addDevUsers from "./add-dev-users"
import addBuiltInTicketTypes from "./add-built-in-ticket-types";

export type Seeder = {
    up: () => Promise<void>,
    down: () => Promise<void>,
}

export type SeedDirection = "up" | "down";

const SEEDERS: { [s: string]: Seeder } = {
    'add-dev-users': addDevUsers,
    'add-built-in-ticket-types': addBuiltInTicketTypes,
}

function usageInfo() {
    console.info("Usage: pnpm prisma db seed <up|down> <all|name-of-seeder: string>")
}

if (SEEDERS['all'] !== undefined) {
    console.log('There is a seeder with a the reserved keyword as the name. Please remove it.')
    process.exit(1);
}

const args = process.argv.filter(s => !s.includes("/"))
if(args.length !== 2) {
    console.error('Not the right amount of arguments.')
    usageInfo();
    process.exit(1);
}

if(!['up', 'down'].includes(args[0])) {
    console.error(`Unknown direction "${args[0]}"`);
    usageInfo();
    process.exit(1);
}
const direction: SeedDirection = args[0] as SeedDirection;
const seederName: string = args[1];

(async () => {
    if (seederName === 'all') {
        console.log('Running all seeders...')
        for (let seedersKey in SEEDERS) {
            await doSeeding(seedersKey, direction);
        }
    } else {
        await doSeeding(seederName, direction);
    }
})()

async function doSeeding(seederName: string, direction: SeedDirection) {
    let seeder: Seeder|undefined = SEEDERS[seederName];
    if(!seeder) {
        console.error(`No seeder called "${seederName}".`);
        process.exit(1);
    }

    if (direction === "down") {
        console.log(`Undoing seeder ${seederName}`)
        await seeder.down();
        console.log(`Undone seeder ${seederName}`)
    } else {
        console.log(`Running seeder ${seederName}`)
        await seeder.up();
        console.log(`Seeder ${seederName} ran successfully`)
    }
}