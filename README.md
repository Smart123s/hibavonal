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
