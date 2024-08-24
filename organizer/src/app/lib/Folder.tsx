import { v4 as uuidv4 } from "uuid";
import { DownArrowIcon, FolderIcon } from "./Icons";
import Link from "next/link";
import { FILE, FILE_Skel } from "./File";

// Enums and types
export enum FolderState {
  UNKNOWN,
  FETCHED,
  OPEN,
}

export type FLDR = {
  id: string;
  fid: string;
  name: string;
  creationDate: Date;
  modificationDate: Date;
  description: string | null;
  open: FolderState;
  parents: FLDR[];
  children: FLDR[];
  files: FILE[];
  size: number;
};

export type FLDR_Skel = {
  id: string;
  children: FLDR_Skel[];
  files: FILE_Skel[];
};

export let dummyFolder = {
  id: "",
  fid: "",
  name: "",
  creationDate: new Date(0),
  modificationDate: new Date(0),
  description: "",
  open: 0,
  children: [],
  files: [],
  parents: [],
  size: 0,
} as FLDR;

export class FolderPool {
  static pool = new Map<string, FLDR>();

  static poolCount = 0;
  static fetchCount = 0;

  static async get(id: string) {
    let f = this.pool.get(id);
    if (f != undefined) {
      this.poolCount++;
      // this.printPoolCount();
      return f;
    }

    try {
      this.fetchCount++;
      // this.printPoolCount();
      const response = await fetch(`http://localhost:3000/folders/${id}/self`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const folderResp = await response.json();
      let folder = convertAPIFolder(folderResp);
      this.pool.set(folder.id, folder);
      return folder;
    } catch (err: any) {
      console.error("Error fetching folders:", err);
    }
    return dummyFolder;
  }

  static printPoolCount() {
    console.log(
      `Fetched ${this.fetchCount} folders and pulled ${this.poolCount} from pool!`
    );
  }
}

export const toggleFolderOpen = (id: string, folders: FLDR[]): FLDR[] => {
  const updateFolderOpenState = (folders: FLDR[]): FLDR[] => {
    return folders.map((folder) => {
      if (folder.fid === id) {
        return {
          ...folder,
          open:
            folder.open === FolderState.UNKNOWN
              ? FolderState.UNKNOWN
              : folder.open === FolderState.FETCHED &&
                folder.children.length > 0
              ? FolderState.OPEN
              : FolderState.FETCHED,
        };
      } else if (folder.children.length > 0) {
        return {
          ...folder,
          children: updateFolderOpenState(folder.children),
        };
      }
      return folder;
    });
  };

  return updateFolderOpenState(folders);
};

export const fetchChildFolders = async (
  id: string,
  fid: string,
  folders: FLDR[],
  setFolders: React.Dispatch<React.SetStateAction<FLDR[]>>
) => {
  try {
    const folder = await FolderPool.get(id);
    if (!folder) return folder;
    const childFolders = folder.children;

    const updateFolders = (parent: FLDR, fid: string): FLDR => {
      if (parent.fid === fid) {
        let parentSize = 0;
        childFolders.forEach((child) => {
          parentSize += child.size;
        });
        return {
          ...parent,
          open:
            parent.open === FolderState.UNKNOWN
              ? FolderState.FETCHED
              : parent.open,
          children: childFolders.map((child: any) => ({
            id: child.id,
            fid: uuidv4(),
            name: child.name,
            creationDate: new Date(child.creationDate),
            modificationDate: new Date(child.modificationDate),
            description: child.description,
            path: child.path,
            open: FolderState.UNKNOWN,
            children: [],
            files: [],
            parents: [parent],
            size: -1,
          })),
          size: parentSize,
        };
      } else if (parent.children.length > 0) {
        parent.children = parent.children.map((child) =>
          updateFolders(child, fid)
        );
        return parent;
      } else {
        return parent;
      }
    };

    setFolders((prevFolders) =>
      prevFolders.map((folder) => updateFolders(folder, fid))
    );
  } catch (error) {
    console.error("Error fetching child folders:", error);
  }
};

export function convertAPIFolder(folder_: {
  folder: {
    id: any;
    name: any;
    creationDate: any;
    modificationDate: any;
    description: any;
    ParentFolders: any[];
    ChildFolders: any[];
    FolderFile: any[];
  };
}) {
  return {
    id: folder_.folder.id,
    fid: uuidv4(),
    name: folder_.folder.name,
    creationDate: folder_.folder.creationDate,
    modificationDate: folder_.folder.modificationDate,
    description: folder_.folder.description,
    open: FolderState.FETCHED,
    parents: folder_.folder.ParentFolders.map((parent: any) => ({
      id: parent.ParentFolder.id,
      fid: uuidv4(),
      name: parent.ParentFolder.name,
      creationDate: new Date(parent.ParentFolder.creationDate),
      modificationDate: new Date(parent.ParentFolder.modificationDate),
      description: parent.ParentFolder.description,
      path: parent.ParentFolder.path,
      open: FolderState.UNKNOWN,
      children: [],
      files: [],
      parents: [],
      size: -1,
    })),
    children: folder_.folder.ChildFolders.map((child: any) => ({
      id: child.ChildFolder.id,
      fid: uuidv4(),
      name: child.ChildFolder.name,
      creationDate: new Date(child.ChildFolder.creationDate),
      modificationDate: new Date(child.ChildFolder.modificationDate),
      description: child.ChildFolder.description,
      path: child.ChildFolder.path,
      open: FolderState.UNKNOWN,
      children: [],
      files: [],
      parents: [],
      size: -1,
    })),
    files: folder_.folder.FolderFile.map((file: any) => ({
      id: file.File.id,
      fid: uuidv4(),
      name: file.File.name,
      creationDate: file.File.creationDate,
      modificationDate: file.File.modificationDate,
      description: file.File.description,
      path: file.File.path,
      version: file.File.version,
      size: file.File.size,
    })),
    size: -1,
  } as FLDR;
}

export function CollapsableFolder({
  folder,
  toggleFolderOpen,
  fetchChildFolders,
}: {
  folder: FLDR;
  toggleFolderOpen: (id: string) => void;
  fetchChildFolders: (id: string, fid: string) => Promise<void>;
}) {
  const handleToggle = async () => {
    if (!folder.open && folder.children.length === 0) {
      await fetchChildFolders(folder.id, folder.fid);
    }
    toggleFolderOpen(folder.fid);
  };

  const handleShowFolder = async () => {
    return;
  };

  const createFolderLink = (folderId: string) => {
    // if(window == undefined) return "#"
    const url = new URL(window.location.href);
    url.searchParams.set("id", folderId);
    return url.toString();
  };

  return (
    <div className="ease-in-out transition-all">
      <div className="w-full h-12 flex flex-row items-center py-2 px-6 group hover:bg-gray-600 hover:bg-opacity-20 hover:cursor-pointer transition-colors">
        <div
          className="w-full h-full flex flex-row items-center"
          onClick={handleShowFolder}
        >
          <FolderIcon
            className={
              "h-full text-center fill-yellow-600 pr-1 group-hover:fill-yellow-400"
            }
          ></FolderIcon>
          <Link
            href={createFolderLink(folder.id)}
            className="w-full text-gray-300 group-hover:text-gray-100"
          >
            {folder.name}
          </Link>
        </div>

        {!(
          folder.open === FolderState.FETCHED && folder.children.length === 0
        ) && (
          <div
            className="h-full aspect-square flex items-center justify-center"
            onClick={handleToggle}
          >
            <DownArrowIcon
              className={`h-4 ${
                folder.open === FolderState.OPEN ? "" : "-rotate-90"
              } transition-transform fill-gray-300 group-hover:fill-gray-100`}
            ></DownArrowIcon>
          </div>
        )}
      </div>
      {folder.open === FolderState.OPEN && (
        <div className={`ml-6`}>
          {folder.children.map((child) => (
            <CollapsableFolder
              key={child.id}
              folder={child}
              toggleFolderOpen={toggleFolderOpen}
              fetchChildFolders={fetchChildFolders}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function CollapsableFolderSkeleton({ folder }: { folder: FLDR_Skel }) {
  return (
    <div className="ease-in-out transition-all">
      <div className="w-full h-12 flex flex-row items-center py-2 px-6">
        <div className="w-full h-full flex flex-row items-center">
          <FolderIcon
            className={"h-full text-center fill-yellow-600 pr-1"}
          ></FolderIcon>
          <div
            className="h-2 rounded-full bg-gray-400"
            style={{ width: `${folder.id.length * 10}%` }}
          ></div>
        </div>

        {!(folder.children.length === 0) && (
          <div className="h-full aspect-square flex items-center justify-center">
            <DownArrowIcon className={`h-4 fill-gray-300`}></DownArrowIcon>
          </div>
        )}
      </div>

      <div className={`ml-6`}>
        {folder.children.map((child) => (
          <CollapsableFolderSkeleton key={child.id} folder={child} />
        ))}
      </div>
    </div>
  );
}

export function GalleryFolder({
  folder,
  onMouseEnter,
  onMouseLeave,
}: {
  folder: FLDR;
  onMouseEnter?: any;
  onMouseLeave?: any;
}) {
  const createFolderLink = (folderId: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set("id", folderId);
    return url.toString();
  };

  return (
    <Link
      href={createFolderLink(folder.id)}
      className="w-32 h-auto flex flex-col group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <FolderIcon
        className={
          "w-full text-center fill-yellow-600 pr-1 group-hover:fill-yellow-400"
        }
      ></FolderIcon>
      <p className="w-full text-center text-gray-300 group-hover:text-gray-100">
        {folder.name}
      </p>
    </Link>
  );
}
