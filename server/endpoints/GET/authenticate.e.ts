import { IncomingMessage, ServerResponse } from "http";
import { login } from "../../auth";

export const options = {
  permissions: [],
};

export const execute = async (
  req: IncomingMessage,
  res: ServerResponse,
  body: string,
  chunks: Buffer[], params: Record<string, string>
) => {
  let authData = JSON.parse(body);
  const token = login(authData.username, authData.password);
  if (token) {
    res.statusCode = 200;
    res.end(JSON.stringify({ token }));
    return true;
  } else {
    res.statusCode = 401;
    res.end(JSON.stringify({ message: "Invalid credentials" }));
    return true;
  }
};
