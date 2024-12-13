import { IncomingMessage, ServerResponse } from "http";
import { permission } from "process";
import Global from "../../statics";

export const options = {
  permissions: []
}

export const execute = async (req: IncomingMessage, res: ServerResponse, body: string, chunks: Buffer[], params: Record<string, string>,
  reqId: string) => {
    // Process the request and send a response
    res.statusCode = 200;
    let response = { message: "Hello from the get endpoint!" };
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "get.e.ts",
      msg: "Ending GET request to /get/ with response",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: response
      },
    })
    return true;
  };