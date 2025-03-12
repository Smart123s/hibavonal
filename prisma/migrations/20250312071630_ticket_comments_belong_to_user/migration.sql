/*
  Warnings:

  - Added the required column `userId` to the `ticket_comments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ticket_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ticketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    CONSTRAINT "ticket_comments_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ticket_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE NO ACTION ON UPDATE CASCADE
);
INSERT INTO "new_ticket_comments" ("content", "id", "ticketId") SELECT "content", "id", "ticketId" FROM "ticket_comments";
DROP TABLE "ticket_comments";
ALTER TABLE "new_ticket_comments" RENAME TO "ticket_comments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
