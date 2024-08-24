import { PrismaClient } from "@prisma/client";

export default class Global {
    static prisma = new PrismaClient();
}