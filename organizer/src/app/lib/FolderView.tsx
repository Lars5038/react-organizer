import React, { useEffect, useState } from "react";
import { convertAPIFolder, dummyFolder, FLDR, GalleryFolder } from "./Folder";
import { v4 as uuidv4 } from "uuid";
import { useSearchParams } from "next/navigation";
import { FILE, GalleryFile } from "./File";
import { FolderIcon } from "./Icons";
import dayjs from "dayjs";

export default function FolderView() {
  const [folders, setFolders] = useState<FLDR[]>([]);
  const [files, setFiles] = useState<FILE[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams ? searchParams.get("id") : "";
  let [folder, setFolder] = useState<FLDR>(dummyFolder);
  let [selectedMedia, setSelectedMedia] = useState<MDIA>(nullMedia);

  useEffect(() => {
    // Only proceed if 'id' is available
    if (!id) {
      setError("Parent cannot be null!");
      return;
    }

    const fetchChildFolders = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/folders/${id}/self`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const folderResp = await response.json();
        let folder_ = convertAPIFolder(folderResp);
        setFolder(folder_);
        setFolders(folder_.children);
        setFiles(folder_.files);
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
    <div className="flex h-full w-full">
      <div className="h-full w-2/3 bg-background-dark p-4">
        <p className="text-gray-300 font-normal tracking-wider text-lg">
          {folder.name}
        </p>
        <div className="w-full h-full grid grid-cols-auto-fill-32 grid-rows-auto-fill-32 gap-2">
          {folders.map((child) => (
            <GalleryFolder
              key={child.fid}
              folder={child}
              onMouseEnter={() => {
                setSelectedMedia({ type: "folder", media: child });
              }}
              onMouseLeave={() => setSelectedMedia(nullMedia)}
            />
          ))}
          {files.map((file) => (
            <GalleryFile key={file.fid} file={file}></GalleryFile>
          ))}
        </div>
      </div>
      <aside className="w-1/3 bg-black-800 h-full">
        <InfoView media={selectedMedia}></InfoView>
      </aside>
    </div>
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
  if (media == null) return <></>;

  if (media.type == "folder") {
    let folder = media.media as FLDR;
    return (
      <div className="w-full h-full flex flex-col items-center">
        <FolderIcon
          className={
            "w-1/3 text-center fill-yellow-600 pr-1 group-hover:fill-yellow-400"
          }
        ></FolderIcon>
        <p className="text-gray-200 font-semibold tracking-wider text-xl">
          {folder.name}
        </p>
        <div className="w-4/5 flex flex-col h-3/5">
          <p className="text-gray-300 pt-2 pb-4 font-normal text-lg">
            {folder.description}
          </p>
          <p className="text-gray-200 py-4 font-semibold text-lg">INFO</p>
          <div className="w-full grid grid-cols-[1fr_2fr] grid-rows-5 gap-4">
            <span className="text-gray-200 font-normal text-lg">Modified:</span>
            <p className="text-gray-300 font-light text-lg">
              {dayjs(folder.modificationDate).format("MMM D, YYYY HH:mm")}
            </p>
            <span className="text-gray-200 font-normal text-lg">Created:</span>
            <p className="text-gray-300 font-light text-lg">
              {dayjs(folder.creationDate).format("MMM D, YYYY HH:mm")}
            </p>
            <span className="text-gray-200 font-normal text-lg">
              Children:{" "}
            </span>
            <p className="text-gray-300 font-light text-lg">
              {folder.children.length}
            </p>
            <span className="text-gray-200 font-normal text-lg">Files: </span>
            <p className="text-gray-300 font-light text-lg">
              {folder.files.length}
            </p>
            <span className="text-gray-200 font-normal text-lg">Parents: </span>
            <p className="text-gray-300 font-light text-lg">
              {folder.parents.length}
            </p>
          </div>
        </div>
      </div>
    );
  }
}
