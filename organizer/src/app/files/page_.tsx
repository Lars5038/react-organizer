import { PrismaClient } from "@prisma/client";

export default async function Files() {
  const prisma = new PrismaClient();

  let folders = await prisma.folder.findMany({
    include: {
      FolderFile: {
        // Include related files
        include: {
          File: true,
        },
      },
      ChildFolders: {
        // Include child folders
        include: {
          ParentFolder: true,
        },
      },
      ParentFolders: {
        // Include parent folders
        include: {
          ChildFolder: true,
        },
      },
      FolderTag: {
        // Include related tags
        include: {
          Tag: true,
        },
      },
    },
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Visualizer</h1>
      <div className="grid grid-cols-3 gap-4">
        {folders.map((folder) => (
          <div key={folder.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{folder.name}</h2>
            <p className="text-gray-600">{folder.description}</p>

            <h3 className="mt-4 text-lg font-semibold">Files</h3>
            <ul className="list-disc list-inside">
              {folder.FolderFile.map((folderFile) => (
                <li key={folderFile.File.id}>
                  {folderFile.File.name} ({folderFile.File.size} bytes)
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-lg font-semibold">Parent Folders</h3>
            <ul className="list-disc list-inside">
              {folder.ChildFolders.map((childFolder) => (
                <li key={childFolder.ParentFolder.id}>
                  {childFolder.ParentFolder.name}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-lg font-semibold">Child Folders</h3>
            <ul className="list-disc list-inside">
              {folder.ParentFolders.map((parentFolder) => (
                <li key={parentFolder.ChildFolder.id}>
                  {parentFolder.ChildFolder.name}
                </li>
              ))}
            </ul>

            <h3 className="mt-4 text-lg font-semibold">Tags</h3>
            <ul className="list-disc list-inside">
              {folder.FolderTag.map((folderTag) => (
                <li key={folderTag.Tag.id}>{folderTag.Tag.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
