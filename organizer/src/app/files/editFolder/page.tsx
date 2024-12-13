"use client";
import { dummyFolder, FLDR, FolderPool } from "@/app/lib/Folder";
import FolderView from "@/app/lib/FolderView";
import { FolderIcon } from "@/app/lib/Icons";
import { formatSize } from "@/app/lib/mime";
import dayjs from "dayjs";
import { useState, useEffect, Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Files() {
  const [currentFolder, setCurrentFolder] = useState<FLDR>(dummyFolder);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get("id") || "b0ec7c6c-af54-4511-bb75-0b2a19aebd54"; // Default folder ID

    let data = {name: "", desc: ""};

    FolderPool.get(id)
      .then((folder) => {
        setCurrentFolder(folder);

      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []); // Dependency array is empty, so this runs once on mount

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-500">ERROR happened</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-8 bg-background-dark">
      <FolderIcon className={"w-1/5 text-center fill-yellow-600"}></FolderIcon>
      <input
        className="text-gray-200 font-semibold tracking-wider text-xl border-b-2 border-gray-600 focus:border-gray-200 bg-transparent focus:outline-none selection:bg-gray-500"
        value={currentFolder?.name}
      ></input>
      <div className="w-1/5 flex flex-col h-3/5">
        <input className="text-gray-300 pt-2 pb-4 font-normal text-base border-b-2 border-gray-600 focus:border-gray-200 bg-transparent focus:outline-none selection:bg-gray-500" value={currentFolder?.description ?? ""}>
        </input>
        <p className="text-gray-200 py-4 font-semibold text-base">INFO</p>

        {/* INFO */}
        <div className="w-full grid grid-cols-[1fr_2fr] grid-rows-6 gap-4">
          <span className="text-gray-200 font-normal text-sm">Modified:</span>
          <p className="text-gray-300 font-light text-sm">
            {dayjs(currentFolder?.modificationDate).format("MMM D, YYYY HH:mm")}
          </p>

          <span className="text-gray-200 font-normal text-sm">Created:</span>
          <p className="text-gray-300 font-light text-sm">
            {dayjs(currentFolder?.creationDate).format("MMM D, YYYY HH:mm")}
          </p>

          <span className="text-gray-200 font-normal text-sm">Children: </span>
          <p className="text-gray-300 font-light text-sm">
            {currentFolder?.children.length}
          </p>

          <span className="text-gray-200 font-normal text-sm">Files: </span>
          <p className="text-gray-300 font-light text-sm">
            {currentFolder?.files.length}
          </p>

          <span className="text-gray-200 font-normal text-sm">Parents: </span>
          <p className="text-gray-300 font-light text-sm">
            {currentFolder?.parents.length}
          </p>

          <span className="text-gray-200 font-normal text-sm">Size: </span>
          <p className="text-gray-300 font-light text-sm">
            {formatSize(currentFolder?.size ?? 0)}
          </p>
        </div>

        <p className="text-gray-200 pt-8 pb-4 font-semibold text-base">
          PARENTS
        </p>
        {/* <div className="-mx-6 -my-4">
            <CollapsableFolder
              folder={folders[0]}
              toggleFolderOpen={handleToggleFolderOpen}
              fetchChildFolders={handleFetchChildFolders}
            />
          </div> */}
      </div>
      <button
        type="submit"
        className="w-1/3 bg-transparent border-2 rounded-lg border-gray-200"
        onClick={() => {}}
      >
        Finish
      </button>
    </div>
  );
}
