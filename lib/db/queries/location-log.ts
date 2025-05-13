import type { InsertLocationLog } from "../schema";

import db from "..";
import { locationLog } from "../schema";

export async function insertLocationLog(
  locationId: number,
  insertable: InsertLocationLog,
  userId: number,
) {
  const [created] = await db.insert(locationLog).values({
    ...insertable,
    locationId,
    userId,
  }).returning();

  return created;
}
