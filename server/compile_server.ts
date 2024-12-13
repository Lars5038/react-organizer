import { exec } from "child_process";
import { promises as fsPromises, writeFile, readFile, statSync, stat } from "fs";
import { extname } from "path";
import { start } from "repl";

// Function to scan directory for files
const scanDirectory = async (dir: string): Promise<string[]> => {
  try {
    const files = await fsPromises.readdir(dir);
    return files;
  } catch (error: any) {
    throw new Error(`Unable to scan directory: ${error.message}`);
  }
};

async function isDirectory(path: string): Promise<boolean> {
  try {
    const stat = await fsPromises.stat(path);
    // console.log(path + " -> " +  stat.isDirectory())
    return stat.isDirectory();
  } catch (error) {
    return false; // Path does not exist or is not accessible
  }
}

const scanDirectoryRecursive = async (dir: string): Promise<string[]> => {
  let returnFiles: string[] = [];
  let files = await scanDirectory(dir);

  for (let file of files) {
    let fullPath = dir + "/" + file;

    if (await isDirectory(fullPath)) {
      let childFiles = await scanDirectoryRecursive(fullPath);
      childFiles.forEach((child) => {
        returnFiles.push(file + "/" + child);
      });
    } else {
      returnFiles.push(file);
    }
  }

  return returnFiles;
};

const readFileContent = async (filePath: string): Promise<string> => {
  try {
    const content = await fsPromises.readFile(filePath, "utf8");
    return content;
  } catch (error: any) {
    throw new Error(`Unable to read file: ${error.message}`);
  }
};

async function isTypeScriptModule(filePath: string) {
  // Check if the file extension is .ts or .tsx
  const fileExtension = extname(filePath);
  if (fileExtension !== ".ts" && fileExtension !== ".tsx") {
    return false;
  }

  try {
    let fileContent = await readFileContent(filePath);

    // Define some TypeScript-specific patterns to look for in the content
    const tsPatterns = [
      /\binterface\b/, // TypeScript interface
      /\btype\b/, // Type alias
      /\benum\b/, // Enum
      /\bnamespace\b/, // Namespace
      /\bmodule\b/, // Module
      /\bimport\b.+from\b/, // ES6 import statement (common in TypeScript)
      /\bexport\b/, // Export statement
    ];

    // Check if any of the patterns match the file content
    return tsPatterns.some((pattern) => pattern.test(fileContent));
  } catch (error) {
    console.error("Error reading file:", error);
    return false;
  }
}

(async () => {
  let methods: { method: string; endpoints: string[] }[] = [];

  let potMethods = await scanDirectory("./endpoints/");
  for (let i = 0; i < potMethods.length; i++) {
    if (!(await isDirectory("./endpoints/" + potMethods[i]))) continue;
    let endpoints: string[] = [];
    let potEndpoints = await scanDirectoryRecursive(
      "./endpoints/" + potMethods[i]
    );

    // console.log(potMethods[i] + ": " + potEndpoints)

    potEndpoints.forEach((pE) => {
      if (pE.endsWith(".e.ts")) endpoints.push(pE);
    });
    methods.push({
      method: potMethods[i],
      endpoints: endpoints,
    });
  }

  let endpointsCode = "";
  let imports: string[] = [];
  let imports_: number = 0;
  for (let m = 0; m < methods.length; m++) {
    let method = methods[m];
    imports_ = 0;
    endpointsCode += `if (req.method === "${method.method}") { // IF ${method.method} START \n`;
    for (let e = 0; e < method.endpoints.length; e++) {
      let endpoint = method.endpoints[e];
      let endpointName_ = endpoint;
      let endpointName = endpoint.replace(".e.ts", "");
      while (endpointName != endpointName_) {
        endpointName_ = endpointName;
        endpointName = endpointName.replace(/[<>:"/\\|?*.\[\]]/, "_");
      }

      if (
        await isTypeScriptModule(`./endpoints/${method.method}/${endpoint}`)
      ) {
        endpointsCode += `
  ${
    imports_ != 0 ? "else" : ""
  } if (getParamValuesFromUrl(req.url, "/${endpoint.replace(".e.ts", "")}") != null) { // IF ${endpoint} START
    let ${endpointName}Module = await import("./endpoints/${method.method}/${endpoint.replace(".e.ts", ".e.js")}");
    if (${endpointName}Module.options) {  
      let authenticated = authenticate(req, res, async () => {
        if (
          ${endpointName}Module.execute &&
          typeof ${endpointName}Module.execute === "function"
        ) {
          let params = getParamValuesFromUrl(req.url, "/${endpoint.replace(".e.ts", "")}");
          let ret = await ${endpointName}Module.execute(req, res, body, chunks, params, reqId);
          if (ret) 
            return;
        }
      }, ${endpointName}Module.options.permissions);
      return;
    }
  } // IF /${endpoint} END
`;

        imports.push(`./endpoints/${method.method}/${endpoint}`);
        imports_++;
      }
    }
    endpointsCode += `
      ${imports_ != 0 ? "else {" : ""}
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Not Found' }));
        return;
      ${imports_ != 0 ? "}" : ""}
    `;
    endpointsCode += `} // IF ${method.method} END\n`;
  }
  endpointsCode += `
      ${methods.length != 0 ? "else {" : ""}
        res.statusCode = 404;
        res.end(JSON.stringify({ message: 'Not Found' }));
        return;
      ${methods.length != 0 ? "}" : ""}
    `;

  // console.log(methods)
  let serverEx = await readFileContent("./server.ex.ts");
  serverEx = serverEx.replace("/* ENDPOINTS */", endpointsCode);

  writeFile("server.ts", serverEx, (err) => {
    if (err) {
      console.error("An error occurred while writing to the file:", err);
    } else {
      console.log("server.ts has been written successfully.");
    }
  });

  let startCode = `tsc server.ts && tsc statics.ts && tsc mime.ts && tsc logger.ts && tsc auth.ts && `;

  let compileDates = await getCompileDates("./compiles.json");

  for(let i = 0; i < imports.length; i++) {
    let imp = imports[i];
    let modTime = statSync(imp).mtime;

      // console.log(`${imp} was compiled last at ${new Date(compileDates.get(imp))}; Last modified: ${new Date(modTime)}; Compile: ${new Date(compileDates.get(imp)) < new Date(modTime)}`);
      if (!compileDates.has(imp) || new Date(compileDates.get(imp)) < new Date(modTime)) {
        startCode += `tsc ${imp} && `;
        // console.log(startCode)
        compileDates.set(imp, new Date());
      }
    }
  
  saveCompileDates("./compiles.json", compileDates);
  startCode += `node server.js`;

  writeFile("start.bat", startCode, (err) => {
    if (err) {
      console.error("An error occurred while writing to the file:", err);
    } else {
      console.log("start.bat has been written successfully.");
    }
  });
})();

async function getCompileDates(path: string) {
  let dates = new Map();

  let datesJson = await readFileContent(path);
  let datesObj = JSON.parse(datesJson);

  datesObj.lastCompiled.forEach((d: { module: any; compileDate: any; }) => {
    dates.set(d.module, d.compileDate);
  });

  return dates;
}

async function saveCompileDates(path: string, dates:Map<string, Date>) {
  let datesObj: {lastCompiled: {module: string, compileDate: Date}[]} = {lastCompiled: []};
  dates.forEach((value, key, map) => {
    datesObj.lastCompiled.push({module: key, compileDate: value})
  })
  writeFile(path, JSON.stringify(datesObj), (err) => {
    if (err) {
      console.error("An error occurred while writing to the file:", err);
    } else {
      console.log(path + " has been written successfully.");
    }
  })
}

// if (req.method === 'POST' && req.url === '/execute') {
//   let body = '';

//   req.on('data', (chunk: Buffer) => {
//     body += chunk.toString();
//   });

//   req.on('end', () => {
//     const { command } = JSON.parse(body);

//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         res.statusCode = 500;
//         res.end(JSON.stringify({ error: error.message, stderr }));
//         return;
//       }

//       res.statusCode = 200;
//       res.end(JSON.stringify({ stdout, stderr }));
//     });
//   });
// } else if (req.method === 'GET' && req.url === '/') {
//   res.statusCode = 200;
//   res.end(JSON.stringify({ status: 'OK' }));
// } else if (req.method === 'GET' && req.url === '/path') {
//   res.statusCode = 200;
//   res.end(JSON.stringify({ status: 'special' }));
// } else {
//   res.statusCode = 404;
//   res.end(JSON.stringify({ message: 'Not Found' }));
// }
