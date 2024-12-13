declare global {
  interface BigInt {
    toJSON(): Number;
  }
}

BigInt.prototype.toJSON = function () {
  return Number(this);
};

import { IncomingMessage, ServerResponse } from "http";
import Global from "../../../../statics";

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
  let id = params.id;
  // console.log(id)
  if (typeof id !== "string") {
    res.statusCode = 400;
    let response = { error: "Invalid folder ID" };
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "modify.e.ts",
      msg: "Ending PUT request to /folders/[id]/modify/ with response badly",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: response
      },
    })
    return true;
  }

  // Extract possible fields from headers
  let newName = req.headers["x-folder-name"] as string | undefined;
  let newDescription = req.headers["x-folder-description"] as
    | string
    | undefined;
  
  // Construct the data object dynamically
  let updateData: Record<string, any> = {};

  if (newName) {
    updateData.name = newName;
  }

  if (newDescription) {
    updateData.description = newDescription;
  }
  
  if (Object.keys(updateData).length === 0) {
    res.statusCode = 400;
    let response = { error: "No valid fields provided to update" };
    
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "modify.e.ts",
      msg: "Ending PUT request to /folders/[id]/modify/ with response badly",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: response
      },
    })
    return true;
  }
  updateData.modificationDate = new Date();
  
  try {
    let folder = await Global.prisma.folder.update({
      where: {
        id: id,
      },
      data: updateData,
    });

    res.statusCode = 200;
    let response = { folder };
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "modify.e.ts",
      msg: "Ending PUT request to /folders/[id]/modify/ with response",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: response
      },
    })
    return true;
  } catch (error) {
    Global.log.error({src: "modify.e.ts", msg: "Error during database access", data: {error: error}});
    res.statusCode = 500;
    let response = { error: "Error updating folders description" };
    
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "modify.e.ts",
      msg: "Ending PUT request to /folders/[id]/modify/ with response badly",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: response
      },
    })
    return true;
  }
};
