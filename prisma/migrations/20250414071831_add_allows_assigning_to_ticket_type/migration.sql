-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_TicketType" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "builtIn" BOOLEAN NOT NULL DEFAULT false,
    "color" TEXT NOT NULL DEFAULT '#17C5C5',
    "allowsEditing" BOOLEAN NOT NULL DEFAULT false,
    "allowsCommenting" BOOLEAN NOT NULL DEFAULT true,
    "allowsAssigning" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_TicketType" ("allowsCommenting", "allowsEditing", "builtIn", "color", "id", "name") SELECT "allowsCommenting", "allowsEditing", "builtIn", "color", "id", "name" FROM "TicketType";
DROP TABLE "TicketType";
ALTER TABLE "new_TicketType" RENAME TO "TicketType";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
