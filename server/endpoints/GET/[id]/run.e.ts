import { IncomingMessage, ServerResponse } from "http";
import Global from "../../../statics";

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
  let response = {params: params}

  res.statusCode = 200;
  res.end(JSON.stringify(response));
  Global.log.info({
    src: "run.e.ts",
    msg: "Ending request to /[id]/run/ with response",
    data: {
      id: reqId,
      statusCode: res.statusCode, 
      response: response
    },
  });
  return true;
};
