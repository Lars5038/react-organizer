import { PrismaClient } from "@prisma/client";
import Logger from "./logger";

declare global {
  interface BigInt {
      toJSON(): Number;
  }
}

export default class Global {
  static prisma = new PrismaClient();
  static log = new Logger();
}
