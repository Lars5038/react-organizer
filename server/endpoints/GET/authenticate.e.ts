import { IncomingMessage, ServerResponse } from "http";
import { login } from "../../auth";
import Global from "../../statics";

export const options = {
  permissions: [],
};

export const execute = async (
  req: IncomingMessage,
  res: ServerResponse,
  body: string,
  chunks: Buffer[], params: Record<string, string>,
  reqId: string
) => {
  let authData = JSON.parse(body);
  const token = login(authData.username, authData.password);
  if (token) {
    res.statusCode = 200;
    let response = {token};
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "authenticate.e.ts",
      msg: "Ending GET request to /authenticate/ with response",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: response
      },
    })
    return true;
  } else {
    res.statusCode = 401;
    let response = {message: "Invalid credentials"}
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "authenticate.e.ts",
      msg: "Ending GET request to /authenticate/ with response",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: response
      },
    })
    return true;
  }
};
