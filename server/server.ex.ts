import { createServer, IncomingMessage, ServerResponse } from "http";
import { authenticate, login } from "./auth";
import Global from "./statics";
import {v4 as uuidv4} from "uuid";

// Parsing Methods for Url Params
function getParamValuesFromUrl(
  url: string,
  template: string
): Record<string, string> | null {
  const templateInfo = parseUrlTemplate(template);
  return extractValuesFromUrl(templateInfo.regex, url, templateInfo.parameters);
}

function extractValuesFromUrl(
  regex: RegExp,
  url: string,
  paramNames: string[]
): Record<string, string> | null {
  const match = url.match(regex);
  if (!match) return null;

  const paramValues: Record<string, string> = {};
  for (let i = 1; i < match.length; i++) {
    paramValues[paramNames[i - 1]] = match[i];
  }
  return paramValues;
}

function parseUrlTemplate(template: string): {
  parameters: string[];
  regex: RegExp;
} {
  const paramRegex = /\[([^\]]+)\]/g;
  const parameters: string[] = [];
  let match: RegExpExecArray | null;
  let regexPattern = template;

  while ((match = paramRegex.exec(template)) !== null) {
    parameters.push(match[1]);
    regexPattern = regexPattern.replace(match[0], "([a-zA-Z0-9-_]+)");
  }

  regexPattern = `^${regexPattern}$`;

  return {
    parameters: parameters,
    regex: new RegExp(regexPattern),
  };
}

const hostname = "127.0.0.1";
const port = 3000;

const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    let body = "";
    let chunks: Buffer[] = [];
    let reqId = uuidv4();
    
    Global.log.info({
      src: "SERVER (server.ex.ts)", 
      msg: "Incoming request",
      data: {
        id: reqId,
        request: {
          method: req.method, 
          headers: req.headers, 
          url: req.url,
          httpVersion: req.httpVersion
        },
      }
    })

    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
      chunks.push(chunk);
    });

    req.on("end", async () => {
      res.setHeader("Access-Control-Allow-Origin", "*"); // Update with your frontend URL
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS, UPDATE"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "*"
      );

      try {
        // Handle preflight requests (OPTIONS)
        if (req.method === "OPTIONS") {
          res.writeHead(204); // No Content
          res.end();
          return;
        }

        /* ENDPOINTS */
      } catch (error: any) {
        res.end(
          JSON.stringify({
            message:
              "An unknown error occurred whilst trying to execute endpoint!",
            error: error,
          })
        );
      }
    });
  }
);

server.listen(port, hostname, async () => {
  Global.log.start()
  Global.log.sys({msg: `Server running at http://${hostname}:${port}/`, src: "server.ex.ts", data: {
    running: "true",
    hostname: hostname,
    port: port
  }});
});

const shutdownHandler = () => {
  Global.log.sys({ msg: "Server is shutting down.", src: "server.ex.ts", data: {
    running: "false",
    hostname: hostname,
    port: port
  }});
  process.exit();
};

process.on('SIGINT', shutdownHandler);
process.on('SIGTERM', shutdownHandler);

process.on('warning', (warning) => {
  Global.log.warning({ msg: "Warning encountered.", src: "server.ex.ts", data: {
    name: warning.name,
    message: warning.message,
    stack: warning.stack
  }});
});

process.on('beforeExit', (code) => {
  Global.log.sys({ msg: `Node is about to exit with code: ${code}`, src: "server.ex.ts", data: {code: code} });
});

process.on('exit', (code) => {
  Global.log.sys({ msg: `Process exited with code ${code}.`, src: "server.ex.ts", data: {code: code} });
});

process.on('uncaughtException', (error) => {
  Global.log.error({ msg: "Server encountered an uncaught exception and is shutting down.", src: "server.ex.ts", data: {
    running: "false",
    hostname: hostname,
    port: port,
    error: error.message,
    stack: error.stack
  }});
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  Global.log.error({ msg: "Server encountered an unhandled promise rejection.", src: "server.ex.ts", data: {
    running: "false",
    hostname: hostname,
    port: port,
    reason: reason,
    promise: promise
  }});
  process.exit(1);
});