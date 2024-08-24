import { createServer, IncomingMessage, ServerResponse } from "http";
import { authenticate, login } from "./auth";

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
    req.on("data", (chunk: Buffer) => {
      body += chunk.toString();
      chunks.push(chunk);
    });

    req.on("end", async () => {
      res.setHeader("Access-Control-Allow-Origin", "*"); // Update with your frontend URL
      res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-File-Path"
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
  console.log(`Server running at http://${hostname}:${port}/`);
});
