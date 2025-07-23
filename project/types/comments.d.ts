import { comments } from "@/lib/db/drizzle/schema";
import { InferSelectModel } from "drizzle-orm";

export type Comment = InferSelectModel<typeof comments>;
