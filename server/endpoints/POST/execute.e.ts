import { exec } from "child_process";
import { IncomingMessage, ServerResponse } from "http";

export const options = {
  permissions: []
}

export const execute = async (req: IncomingMessage, res: ServerResponse, body: string, chunks: Buffer[], params: Record<string, string>) => {
    // Process the request and send a response
    const { command } = JSON.parse(body);

    exec(command, (error, stdout, stderr) => {
      if (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: error.message, stderr }));
        return;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({ stdout, stderr }));
      return;
    });
    return true;
};