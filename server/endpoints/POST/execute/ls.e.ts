import { IncomingMessage, ServerResponse } from "http";

export const options = {
  permissions: []
}

export const execute = async (req: IncomingMessage, res: ServerResponse, body: string, chunks: Buffer[], params: Record<string, string>) => {
    // Process the request and send a response
    res.statusCode = 200;
    res.end(JSON.stringify({ message: "Hello from ls endpoint!" }));
    return true;
  };