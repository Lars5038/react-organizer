import React, { Children, useEffect, useState } from "react";
import {
  CollapsableFolder,
  convertAPIFolder,
  dummyFolder,
  FLDR,
  FolderPool,
  GalleryFolder,
  toggleFolderOpen,
  fetchChildFolders,
  FolderState,
  CreateFolder,
} from "./Folder";

import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "next/navigation";
import { FILE, GalleryFile } from "./File";
import { FileIcon, FolderIcon } from "./Icons";
import dayjs from "dayjs";
import { formatSize } from "./mime";
import { Folder } from "@prisma/client";

export default function FolderView() {
  const [folders, setFolders] = useState<FLDR[]>([]);
  const [files, setFiles] = useState<FILE[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get("id") : "";
  let [folder, setFolder] = useState<FLDR>(dummyFolder);
  let [selectedMedia, setSelectedMedia] = useState<MDIA[]>([nullMedia]);

  useEffect(() => {
    // Only proceed if 'id' is available
    if (!id || id == null) {
      setError("Parent cannot be null!");
      return;
    }

    const fetchChildFolders = async () => {
      try {
        let folder = await FolderPool.get(id);
        if (!folder) return;
        setFolder(folder);
        setFolders(folder.children);
        setFiles(folder.files);
        setSelectedMedia([
          {
            type: "folder",
            media: folder,
          },
        ]);
      } catch (err: any) {
        console.error("Error fetching folders:", err);
        setError(err.message);
      }
    };

    fetchChildFolders();
  }, [id]); // Add 'id' as a dependency to react to changes

  // Handle rendering based on error and parent status
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="flex h-full w-full flex-col md:flex-row">
        <div className="h-3/5 w-full md:h-full overflow-y-scroll md:w-2/3 bg-background-dark p-4">
          <p className="text-gray-200 font-semibold tracking-wider text-xl py-4">
            {folder.name} - Folders
          </p>
          <div className="w-full flex flex-row flex-wrap content-start gap-2 overflow-y-scroll pb-2">
            {folders.map((child) => (
              <GalleryFolder
                key={child.fid}
                folder={child}
                onMouseEnter={async () => {
                  setSelectedMedia([
                    ...selectedMedia,
                    {
                      type: "folder",
                      media: await FolderPool.get(child.id),
                    },
                  ]);
                }}
                onMouseLeave={() => {
                  setSelectedMedia(selectedMedia.slice(0, -1));
                }}
              />
            ))}
            <CreateFolder parentId={id ? id : ""} setFolders={setFolders} setFolder={setFolder}></CreateFolder>
          </div>
          <p className="text-gray-200 font-semibold tracking-wider text-xl py-4">
            {folder.name} - Files
          </p>
          <div className="w-full flex flex-row flex-wrap content-start gap-2 overflow-y-scroll">
            {files.map((file) => (
              <GalleryFile
                key={file.fid}
                file={file}
                onMouseEnter={async () => {
                  setSelectedMedia([
                    ...selectedMedia,
                    {
                      type: "file",
                      media: file,
                    },
                  ]);
                }}
                onMouseLeave={() => {
                  setSelectedMedia(selectedMedia.slice(0, -1));
                }}
              ></GalleryFile>
            ))}
          </div>
        </div>
        <div className="w-full h-2/5 md:w-1/3 md:h-full bg-black-800 overflow-y-scroll">
          <InfoView media={selectedMedia[selectedMedia.length - 1]}></InfoView>
        </div>
      </div>
    </>
  );
}

type MDIA = {
  type: string;
  media: FLDR | FILE | null;
};

let nullMedia = {
  type: "null",
  media: null,
};

function InfoView({ media }: { media: MDIA }) {
  const [folders, setFolders] = useState([dummyFolder]);

  useEffect(() => {
    if (media?.type === "folder") {
      let folder = media.media as FLDR;

      let fid = uuidv4();

      let parentsFolder = {
        id: folder.id,
        fid: fid,
        name: "Parents",
        creationDate: new Date(0),
        modificationDate: new Date(0),
        description: "",
        open: FolderState.FETCHED,
        files: [],
        size: 0,
        children: [
          ...folder.parents.map((par) => ({
            ...par,
            open: FolderState.FETCHED,
            children: [],
            parents: [],
          })),
        ],
        parents: [],
      } as FLDR;

      setFolders([parentsFolder]);
    }
  }, [media]); // Run this effect when media changes

  if (media == null) return <></>;

  const handleToggleFolderOpen = (id: string) => {
    setFolders((prevFolders) => toggleFolderOpen(id, prevFolders));
  };

  const handleFetchChildFolders = async (id: string, fid: string) => {
    await fetchChildFolders(id, fid, folders, setFolders);
  };

  if (media.type === "folder") {
    let folder = media.media as FLDR;

    return (
      <div className="w-full h-full flex flex-col items-center">
        <FolderIcon
          className={"w-1/3 text-center fill-yellow-600"}
        ></FolderIcon>
        <p className="text-gray-200 font-semibold tracking-wider text-xl">
          {folder.name}
        </p>
        <div className="w-4/5 flex flex-col h-3/5">
          <p className="text-gray-300 pt-2 pb-4 font-normal text-base">
            {folder.description}
          </p>
          <p className="text-gray-200 py-4 font-semibold text-base">INFO</p>

          {/* INFO */}
          <div className="w-full grid grid-cols-[1fr_2fr] grid-rows-6 gap-4">
            <span className="text-gray-200 font-normal text-sm">Modified:</span>
            <p className="text-gray-300 font-light text-sm">
              {dayjs(folder.modificationDate).format("MMM D, YYYY HH:mm")}
            </p>

            <span className="text-gray-200 font-normal text-sm">Created:</span>
            <p className="text-gray-300 font-light text-sm">
              {dayjs(folder.creationDate).format("MMM D, YYYY HH:mm")}
            </p>

            <span className="text-gray-200 font-normal text-sm">
              Children:{" "}
            </span>
            <p className="text-gray-300 font-light text-sm">
              {folder.children.length}
            </p>

            <span className="text-gray-200 font-normal text-sm">Files: </span>
            <p className="text-gray-300 font-light text-sm">
              {folder.files.length}
            </p>

            <span className="text-gray-200 font-normal text-sm">Parents: </span>
            <p className="text-gray-300 font-light text-sm">
              {folder.parents.length}
            </p>

            <span className="text-gray-200 font-normal text-sm">Size: </span>
            <p className="text-gray-300 font-light text-sm">
              {formatSize(folder.size)}
            </p>
          </div>

          <p className="text-gray-200 pt-8 pb-4 font-semibold text-base">
            PARENTS
          </p>
          <div className="-mx-6 -my-4">
            <CollapsableFolder
              folder={folders[0]}
              toggleFolderOpen={handleToggleFolderOpen}
              fetchChildFolders={handleFetchChildFolders}
            />
          </div>
        </div>
      </div>
    );
  } else if (media.type === "file") {
    let file = media.media as FILE;

    return (
      <div className="w-full h-full flex flex-col items-center">
        <FileIcon
          wrapperClass="w-1/3 aspect-square"
          className={"w-3/6 text-center fill-gray-700"}
        ></FileIcon>
        <p className="text-gray-200 font-semibold tracking-wider text-xl">
          {file.name}
        </p>
        <div className="w-4/5 flex flex-col h-3/5">
          <p className="text-gray-300 pt-2 pb-4 font-normal text-base">
            {file.description}
          </p>
          <p className="text-gray-200 py-4 font-semibold text-base">INFO</p>

          {/* INFO */}
          <div className="w-full grid grid-cols-[1fr_2fr] grid-rows-5 gap-4">
            <span className="text-gray-200 font-normal text-sm">Modified:</span>
            <p className="text-gray-300 font-light text-sm">
              {dayjs(file.modificationDate).format("MMM D, YYYY HH:mm")}
            </p>

            <span className="text-gray-200 font-normal text-sm">Created:</span>
            <p className="text-gray-300 font-light text-sm">
              {dayjs(file.creationDate).format("MMM D, YYYY HH:mm")}
            </p>

            <span className="text-gray-200 font-normal text-sm">Version:</span>
            <p className="text-gray-300 font-light text-sm">{file.version}</p>

            <span className="text-gray-200 font-normal text-sm">Path: </span>
            <p className="text-gray-300 font-light text-sm">{file.path}</p>

            <span className="text-gray-200 font-normal text-sm">Size: </span>
            <p className="text-gray-300 font-light text-sm">
              {formatSize(file.size)}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
