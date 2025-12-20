import { PrismaClient } from "@prisma/client";

const globalprisma = global as  unknown as { prisma: PrismaClient };
export const prisma = 
globalprisma.prisma || new PrismaClient({
  log: ["query"],
}); 
if (process.env.NODE_ENV !== "production") globalprisma.prisma = prisma;  
 export default prisma;