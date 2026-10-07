import { defineRelations, sql } from "drizzle-orm";
import { pgTable, text, uuid } from "drizzle-orm/pg-core";

export const categoryTable = pgTable("category", {
  id: uuid()
    .default(sql`uuidv7()`)
    .primaryKey(),
  name: text().notNull(),
});

export default defineRelations({ categoryTable }, () => ({}));
