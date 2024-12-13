"use client";

import { convertAPIFolder, dummyFolder, FLDR, FolderPool } from "@/app/lib/Folder";
import FolderStructure, {
  FolderStructureSkeleton,
} from "@/app/lib/FolderStruc";
import FolderView from "@/app/lib/FolderView";
import { useState, useEffect, Suspense, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const [folder, setFolder] = useState<FLDR | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (folder == null) {
      const id = "b0ec7c6c-af54-4511-bb75-0b2a19aebd54"; // HOME Folder
      FolderPool.get(id).then((folder) => {
        if(folder)
          setFolder(folder);
      })
    }
  }); // Dependency array is empty, so this runs once on mount

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-red-500">ERROR happened</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!folder) {
    return (
      <ViewSkeleton>{children} </ViewSkeleton>
    );
  }

  return <View folder={folder}>{children}</View>;
}

function ViewSkeleton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row h-screen w-full bg-background-dark">
      {/* <aside className="w-16 bg-gray-700 h-full"></aside> */}
      <div className="flex flex-col h-full w-full">
        <nav className="h-16 w-full "></nav> {/* top navbar */}
        <div className="flex flex-row h-full w-full">
          <aside className="w-72 bg-black-700 h-full hidden md:block">
            <p className="text-gray-300 pt-4 px-6 font-normal tracking-wider text-lg">
              FOLDERS
            </p>
              <FolderStructureSkeleton />
          </aside>{" "}
          {/* inner left folder structure */}
          {children}
        </div>
      </div>
    </div>
  );
}


function View({
  children,
  folder,
}: {
  children: React.ReactNode;
  folder: FLDR;
}) {
  return (
    <div className="flex flex-row h-screen w-full bg-background-dark">
      {/* <aside className="w-16 bg-gray-700 h-full"></aside> */}
      <div className="flex flex-col w-full">
        <nav className="h-16 w-full"></nav> {/* top navbar */}
        <div className="flex flex-row w-full">
          <aside className="w-72 bg-black-700 h-full hidden lg:block">
            <p className="text-gray-300 pt-4 px-6 font-normal tracking-wider text-lg">
              FOLDERS
            </p>
            <Suspense fallback={<FolderStructureSkeleton />}>
              <FolderStructure folder_={folder} />
            </Suspense>
          </aside>{" "}
          {/* inner left folder structure */}
          {children}
        </div>
      </div>
    </div>
  );
}
