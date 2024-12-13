import { IncomingMessage, ServerResponse } from "http";
import * as fs from "fs";
import { EndpointOptions } from "../../types";
import Global from "../../statics";

export const options: EndpointOptions = {
  permissions: ["upload"],
};

export const execute = async (
  req: IncomingMessage,
  res: ServerResponse,
  body: string,
  chunks: Buffer[],
  params: Record<string, string>,
  reqId: string
): Promise<boolean> => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (!req.headers["content-type"]) {
    res.writeHead(400, { "Content-Type": "text/json" });
    res.end(JSON.stringify({ msg: "Invalid request: mission contenttype" }));
    return true;
  }

  const boundary = req.headers["content-type"].split("=")[1];

  const data = Buffer.concat(chunks);
  // Parse headers to extract the filename
  const headerPart = data.slice(0, data.indexOf("\r\n\r\n")).toString();

  const filenameMatch = headerPart.match(/filename="([^"]+)"/);
  if (!filenameMatch) {
    res.writeHead(400, { "Content-Type": "text/json" });
    res.end(JSON.stringify({ msg: "Invalid request: Filename not found." }));
    return true;
  }

  const filename = filenameMatch[1];

  // Find the start and end of the data in the buffer
  const start = data.indexOf("\r\n\r\n") + 4; // Skip past the header of the part
  const end = data.lastIndexOf(`\r\n--${boundary}--`); // Stop before the final boundary

  if (start === -1 || end === -1) {
    res.writeHead(400, { "Content-Type": "text/json" });
    let response = { msg: "Invalid request: Data not found." };
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "upload.e.ts",
      msg: "Ending POST request to /upload/ with response",
      data: {
        id: reqId,
        statusCode: res.statusCode,
        response: response,
      },
    });
    return true;
  }

  const fileData = data.slice(start, end);

  // Create the uploads directory if it doesn't exist
  const uploadDir = "../files/uploads";
  fs.mkdirSync(uploadDir, { recursive: true });

  // Define the path for the uploaded file
  const filePath = `${uploadDir}/${filename}`;

  // Save the data to a file
  fs.writeFile(filePath, fileData, (err) => {
    if (err) {
      res.writeHead(500, { "Content-Type": "text/json" });
      let response = { msg: "Failed to save file." };
      res.end(JSON.stringify(response));
      Global.log.info({
        src: "upload.e.ts",
        msg: "Ending POST request to /upload/ with response",
        data: {
          id: reqId,
          statusCode: res.statusCode,
          response: response,
        },
      });
      Global.log.error({
        src: "upload.e.ts",
        msg: "Failed to save file:",
        data: { error: err },
      });
      return true;
    }

    res.writeHead(200, { "Content-Type": "text/json" });
    let response = { msg: "File uploaded successfully." };
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "upload.e.ts",
      msg: "Ending POST request to /upload/ with response",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: response
      },
    })
    return true;
  });

  return true;
};
