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
console.log("CREATING FOLDER???!?!")

  const folderName = req.headers["folder-name"];
  const folderDescription = req.headers["folder-description"];
  const parentFolderId = Array.isArray(req.headers["parent-folder-id"]) ? req.headers["parent-folder-id"][0] : req.headers["parent-folder-id"];

  if (typeof folderName !== "string" || typeof folderDescription !== "string" || (parentFolderId && typeof parentFolderId !== "string")) {
    res.statusCode = 400;
    const response = { error: "Invalid folder name, description, or parent folder ID" };
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "create.e.ts",
      msg: "Ending POST request to /folder/create with response",
      data: {
        id: reqId,
        statusCode: res.statusCode,
        response: response,
      },
    });
    return true;
  }

  try {
    const newFolder = await Global.prisma.folder.create({
      data: {
        name: folderName,
        description: folderDescription,
        modificationDate: new Date(),
        creationDate: new Date()
      },
    });

    if (parentFolderId) {
      await Global.prisma.folderFolder.create({
        data: {
          parentfolderid: parentFolderId,
          childfolderid: newFolder.id,
        },
      });
    }

    res.statusCode = 201;
    const response = { folder: newFolder };
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "create.e.ts",
      msg: "Ending POST request to /folder/create with response",
      data: {
        id: reqId,
        statusCode: res.statusCode,
        response: "Hiding response - Response [newFolder]",
      },
    });
    return true;
  } catch (error) {
    console.error(error);
    res.statusCode = 500;
    const response = { error: "Error creating folder" };
    res.end(JSON.stringify(response));
    Global.log.info({
      src: "create.e.ts",
      msg: "Ending POST request to /folder/create with response badly",
      data: {
        id: reqId,
        statusCode: res.statusCode,
        response: response,
      },
    });
    return true;
  }
};