import { PrismaClient } from "@prisma/client";
const dbInstance = new PrismaClient();
export default dbInstance;
