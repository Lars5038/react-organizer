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

        if (req.method === "GET") { // IF GET START 

   if (getParamValuesFromUrl(req.url, "/authenticate") != null) { // IF authenticate.e.ts START
    let authenticateModule = await import("./endpoints/GET/authenticate.e.js");
    if (authenticateModule.options) {  
      let authenticated = authenticate(req, res, async () => {
        if (
          authenticateModule.execute &&
          typeof authenticateModule.execute === "function"
        ) {
          let params = getParamValuesFromUrl(req.url, "/authenticate");
          let ret = await authenticateModule.execute(req, res, body, chunks, params);
          if (ret) 
            return;
        }
      }, authenticateModule.options.permissions);
      return;
    }
  } // IF /authenticate.e.ts END

  else if (getParamValuesFromUrl(req.url, "/file") != null) { // IF file.e.ts START
    let fileModule = await import("./endpoints/GET/file.e.js");
    if (fileModule.options) {  
      let authenticated = authenticate(req, res, async () => {
        if (
          fileModule.execute &&
          typeof fileModule.execute === "function"
        ) {
          let params = getParamValuesFromUrl(req.url, "/file");
          let ret = await fileModule.execute(req, res, body, chunks, params);
          if (ret) 
            return;
        }
      }, fileModule.options.permissions);
      return;
    }
  } // IF /file.e.ts END

  else if (getParamValuesFromUrl(req.url, "/folders/[id]/self") != null) { // IF folders/[id]/self.e.ts START
    let folders__id__selfModule = await import("./endpoints/GET/folders/[id]/self.e.js");
    if (folders__id__selfModule.options) {  
      let authenticated = authenticate(req, res, async () => {
        if (
          folders__id__selfModule.execute &&
          typeof folders__id__selfModule.execute === "function"
        ) {
          let params = getParamValuesFromUrl(req.url, "/folders/[id]/self");
          let ret = await folders__id__selfModule.execute(req, res, body, chunks, params);
          if (ret) 
            return;
        }
      }, folders__id__selfModule.options.permissions);
      return;
    }
  } // IF /folders/[id]/self.e.ts END

  else if (getParamValuesFromUrl(req.url, "/get") != null) { // IF get.e.ts START
    let getModule = await import("./endpoints/GET/get.e.js");
    if (getModule.options) {  
      let authenticated = authenticate(req, res, async () => {
        if (
          getModule.execute &&
          typeof getModule.execute === "function"
        ) {
          let params = getParamValuesFromUrl(req.url, "/get");
          let ret = await getModule.execute(req, res, body, chunks, params);
          if (ret) 
            return;
        }
      }, getModule.options.permissions);
      return;
    }
  } // IF /get.e.ts END

  else if (getParamValuesFromUrl(req.url, "/[id]/run") != null) { // IF [id]/run.e.ts START
    let _id__runModule = await import("./endpoints/GET/[id]/run.e.js");
    if (_id__runModule.options) {  
      let authenticated = authenticate(req, res, async () => {
        if (
          _id__runModule.execute &&
          typeof _id__runModule.execute === "function"
        ) {
          let params = getParamValuesFromUrl(req.url, "/[id]/run");
          let ret = await _id__runModule.execute(req, res, body, chunks, params);
          if (ret) 
            return;
        }
      }, _id__runModule.options.permissions);
      return;
    }
  } // IF /[id]/run.e.ts END

      else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Not Found' }));
        return;
      }
    } // IF GET END
if (req.method === "POST") { // IF POST START 

   if (getParamValuesFromUrl(req.url, "/execute/ls") != null) { // IF execute/ls.e.ts START
    let execute_lsModule = await import("./endpoints/POST/execute/ls.e.js");
    if (execute_lsModule.options) {  
      let authenticated = authenticate(req, res, async () => {
        if (
          execute_lsModule.execute &&
          typeof execute_lsModule.execute === "function"
        ) {
          let params = getParamValuesFromUrl(req.url, "/execute/ls");
          let ret = await execute_lsModule.execute(req, res, body, chunks, params);
          if (ret) 
            return;
        }
      }, execute_lsModule.options.permissions);
      return;
    }
  } // IF /execute/ls.e.ts END

  else if (getParamValuesFromUrl(req.url, "/execute") != null) { // IF execute.e.ts START
    let executeModule = await import("./endpoints/POST/execute.e.js");
    if (executeModule.options) {  
      let authenticated = authenticate(req, res, async () => {
        if (
          executeModule.execute &&
          typeof executeModule.execute === "function"
        ) {
          let params = getParamValuesFromUrl(req.url, "/execute");
          let ret = await executeModule.execute(req, res, body, chunks, params);
          if (ret) 
            return;
        }
      }, executeModule.options.permissions);
      return;
    }
  } // IF /execute.e.ts END

  else if (getParamValuesFromUrl(req.url, "/upload") != null) { // IF upload.e.ts START
    let uploadModule = await import("./endpoints/POST/upload.e.js");
    if (uploadModule.options) {  
      let authenticated = authenticate(req, res, async () => {
        if (
          uploadModule.execute &&
          typeof uploadModule.execute === "function"
        ) {
          let params = getParamValuesFromUrl(req.url, "/upload");
          let ret = await uploadModule.execute(req, res, body, chunks, params);
          if (ret) 
            return;
        }
      }, uploadModule.options.permissions);
      return;
    }
  } // IF /upload.e.ts END

      else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Not Found' }));
        return;
      }
    } // IF POST END

      else {
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Not Found' }));
        return;
      }
    
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
