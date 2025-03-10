## Hibavonal

## Dev setup

1. Install pnpm

2. Git clone this repo

3. `pnpm install`

4. Copy `.env.example` as `.env`

5. Generate database models
   `pnpm exec prisma migrate dev`

6. Disable extensions that modify the page (ex. DarkReader)

7. Start with `pnpm run dev`

## DB migration

`pnpm exec prisma migrate dev --name <name>`

## DB seeding
`pnpm prisma db seed <up|down> <all|name-of-seeder: string>`

To add your own seeder:
- Make a seeder file in the prisma/seeds folder
- Export a seeder type object from it
- Register it in prisma/seeds/main.ts, into the SEEDERS map
