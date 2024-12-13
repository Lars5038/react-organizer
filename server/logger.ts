import dayjs = require("dayjs");
import {
  appendFile,
  existsSync,
  mkdir,
  promises,
  writeFile,
  writeFileSync,
} from "fs";
import { v4 as uuidv4 } from "uuid";

export default class Logger {
  currentLog = dayjs(0);
  logObj: {
    type: string;
    timestamp: dayjs.Dayjs;
    uuid: string;
    src: string;
    msg: string;
    data: any;
  }[] = [];

  getLogFile() {
    return (
      "./logs/" + this.currentLog.format("YYYY-MM-DD_HH-mm-ss-SSSZZ") + ".log"
    );
  }

  getJsonLogFile() {
    return (
      "./logs/" +
      this.currentLog.format("YYYY-MM-DD_HH-mm-ss-SSSZZ") +
      ".log.json"
    );
  }

  async start() {
    console.log("Starting logging");

    if (!existsSync("./logs/")) {
      console.log("Creating Logs Folder");
      mkdir("./logs/", { recursive: true }, (err) => {
        if (err) {
          console.error("Error creating logs directory:", err);
          return;
        }
      });
    }
    if (this.currentLog != dayjs(0)) this.stop();
    this.currentLog = dayjs();

    if (!existsSync(this.getLogFile())) {
      writeFileSync(this.getLogFile(), "");
    }
    if (!existsSync(this.getJsonLogFile())) {
      writeFileSync(this.getJsonLogFile(), JSON.stringify([]));
    }
  }

  stop() {
    // if (this.currentLog == dayjs(0)) return;
    this.currentLog = dayjs(0);
    this.logObj = [];
  }

  info(msg: { src: string; msg: string; data: any }) {
    this.log({
      type: "info",
      ...msg,
    });
  }

  sys(msg: { src: string; msg: string; data: any }) {
    this.log({
      type: "system",
      ...msg,
    });
  }

  error(msg: { src: string; msg: string; data: any }) {
    this.log({
      type: "error",
      ...msg,
    });
  }

  warning(msg: { src: string; msg: string; data: any }) {
    this.log({
      type: "warn",
      ...msg,
    });
  }

  log(msg: { type: string; src: string; msg: string; data: any }) {
    if (this.currentLog == dayjs(0)) console.error("Logging isn't started!");
    let currentTime = dayjs();

    let msgObj = {
      type: msg.type,
      timestamp: currentTime,
      uuid: uuidv4(),
      src: msg.src,
      msg: msg.msg,
      data: msg.data,
    };

    let logMsg = `[${msgObj.type
      .toUpperCase()
      .padEnd(6, " ")}]: ${msgObj.timestamp.format(
      "YYYY-MM-DD_HH-mm-ss-SSSZ"
    )} ${msgObj.src}: \n          ${msgObj.msg}`;

    logMsg += logObj(msgObj.data, "              ");

    console.log(logMsg);

    appendFile(this.getLogFile(), `\n${logMsg}\n`, (err) => {
      if (err) {
        console.error("An error occurred while writing to the logFile:", err);
      }
    });

    readFileContent(this.getJsonLogFile()).then((jsonLog) => {
      this.logObj.push(msgObj);
      writeFile(this.getJsonLogFile(), JSON.stringify(this.logObj), (err) => {
        if (err) {
          console.error(
            "An error occurred while writing to the jsonLogFile:",
            err
          );
        }
      });
    });

    console.log();
  }
}

let logObj = (obj: Object, pref: string = "", seen = new Set()): string => {
  let ret = "";

  // Prüfe, ob das Objekt bereits besucht wurde, um zirkuläre Referenzen zu vermeiden
  if (seen.has(obj)) {
    return `${pref}[Circular Reference]`;
  }

  // Füge das aktuelle Objekt dem Set hinzu
  if (typeof obj === "object" && obj !== null) {
    seen.add(obj);
  } else {
    // Wenn der Wert kein Objekt ist, einfach zurückgeben
    return `${pref}${obj}`;
  }

  for (const [key, value] of Object.entries(obj)) {
    ret += `\n${pref}${key}: `;
    if (typeof value === "object" && value !== null) {
      ret += logObj(value, pref + "  ", seen);
    } else {
      ret += `${value}`;
    }
  }

  return ret;
};

const readFileContent = async (filePath: string): Promise<string> => {
  try {
    const content = await promises.readFile(filePath, "utf8");
    return content;
  } catch (error: any) {
    throw new Error(`Unable to read file: ${error.message}`);
  }
};
