import { exec } from "child_process";
import { IncomingMessage, ServerResponse } from "http";
import Global from "../../statics";

export const options = {
  permissions: [],
};

export const execute = async (
  req: IncomingMessage,
  res: ServerResponse,
  body: string,
  chunks: Buffer[],
  params: Record<string, string>,
  reqId: string
) => {
  // Process the request and send a response
  const { command } = JSON.parse(body);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.statusCode = 500;
      let response = { error: error.message, stderr };
      res.end(JSON.stringify(response));
      Global.log.info({
        src: "execute.e.ts",
        msg: "Ending POST request to /execute/ with response badly",
        data: {
          id: reqId,
          statusCode: res.statusCode,
          response: response,
        },
      });
      return;
    }

    res.statusCode = 200;
    let response = { stdout, stderr };
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "execute.e.ts",
      msg: "Ending POST request to /execute/ with response",
      data: {
        id: reqId,
        statusCode: res.statusCode,
        response: response,
      },
    });
    return;
  });
  return true;
};
