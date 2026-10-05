import { createServerFn } from "@tanstack/react-start";

import { db } from "@/db";

export const getCategoryList = createServerFn().handler(async () => {
  return await db.query.categoryTable.findMany();
});
