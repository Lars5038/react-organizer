BigInt.prototype.toJSON = function () { return Number(this) }

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
  if (typeof id !== "string") {
    res.statusCode = 400;
    let response = {error: "Invalid folder ID"}
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "self.e.ts",
      msg: "Ending GET request to /folder/[id]/self/ with response",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: response
      },
    })
    return true;
  }

  try {
    let folder = await Global.prisma.folder.findUnique({
        where: {
          id: id,
        },
        include: {
          ChildFolders: {
            include: {
              ChildFolder: true
            }
          },
          ParentFolders: {
            include: {
              ParentFolder: true
            }
          },
          FolderFile: {
            include: {
              File: true
            }
          },
          FolderTag: {
            include: {
              Tag: true
            }
          }
        }
      })

      // console.log(folder);

    res.statusCode = 200;
    let response = {folder}
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "self.e.ts",
      msg: "Ending GET request to /folder/[id]/self/ with response",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: "Hiding response - Response [folder]"
      },
    })
    return true;
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    let response = { error: "Error fetching folder" };
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "self.e.ts",
      msg: "Ending GET request to /folder/[id]/self/ with response badly",
      data: {
        id: reqId,
        statusCode: res.statusCode, 
        response: response
      },
    })
    return true;
  }
};
