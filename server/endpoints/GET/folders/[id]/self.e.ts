declare global {
  interface BigInt {
      toJSON(): Number;
  }
}

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
  params: Record<string, string>
) => {
  let id = params.id;
  if (typeof id !== "string") {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid folder ID" }));
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
    res.end(JSON.stringify({folder}));
    return true;
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Error fetching child folders" }));
    return true;
  }
};
