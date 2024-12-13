import { IncomingMessage, ServerResponse } from "http";
import * as fs from "fs";
import * as path from "path";
import { EndpointOptions } from "../../types";
import mimeTypes from "../../mime";
import Global from "../../statics";

export const options: EndpointOptions = {
  permissions: [],
};

export const execute = async (
  req: IncomingMessage,
  res: ServerResponse,
  body: string,
  chunks: Buffer[],
  params: Record<string, string>,
  reqId: string
): Promise<boolean> => {
  try {
    // Get the file path from the headers
    const filePath = path.join(
      "../files/",
      req.headers["x-file-path"] as string
    );

    // Validate the file path
    if (!filePath) {
      res.statusCode = 400;
      let response = "File path is required.";
      res.end(JSON.stringify(response));
      Global.log.info({
        src: "file.e.ts",
        msg: "Ending GET request to /file/ with response badly",
        data: {
          id: reqId,
          statusCode: res.statusCode,
          response: response,
        },
      });

      return false;
    }

    const fullPath = path.resolve(filePath);

    // Check if the file exists
    if (!fs.existsSync(fullPath)) {
      res.statusCode = 404;
      let response = "File not found.";
      res.end(JSON.stringify(response));
      Global.log.info({
        src: "file.e.ts",
        msg: "Ending GET request to /file/ with response badly",
        data: {
          id: reqId,
          statusCode: res.statusCode,
          response: response,
        },
      });
      return false;
    }

    // Stream the file to the response
    const fileStream = fs.createReadStream(fullPath);

    // Determine the MIME type based on the file extension
    const ext = path.extname(fullPath).toLowerCase();
    const mimeType = mimeTypes[ext] || "application/octet-stream";
    // Set the correct Content-Type header
    res.setHeader("Content-Type", mimeType);

    // Set appropriate headers (adjust as necessary)
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${path.basename(fullPath)}"`
    );
    // res.setHeader("Content-Type", "application/octet-stream");

    fileStream.pipe(res);

    // Wait for the stream to finish
    fileStream.on("end", () => {
      res.statusCode = 200;
      Global.log.info({
        src: "file.e.ts",
        msg: "Ending GET request to /file/ with response",
        data: {
          id: reqId,
          statusCode: res.statusCode,
          response: {
            file: path.basename(fullPath),
          },
        },
      });
      res.end();
    });

    fileStream.on("error", (err) => {
      res.statusCode = 500;
      let response = "Internal Server Error.";
      res.end(JSON.stringify(response));
      Global.log.info({
        src: "file.e.ts",
        msg: "Ending GET request to /file/ with response badly",
        data: {
          id: reqId,
          statusCode: res.statusCode,
          response: response,
        },
      });
    });

    return true;
  } catch (error) {
    res.statusCode = 500;
    let response = "Internal Server Error.";
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "file.e.ts",
      msg: "Ending GET request to /file/ with response badly",
      data: {
        id: reqId,
        statusCode: res.statusCode,
        response: response,
      },
    });
    return false;
  }
};
