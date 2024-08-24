"use client";
import { useState } from "react";
import {
  CollapsableFolder,
  FLDR,
  toggleFolderOpen,
  fetchChildFolders,
  CollapsableFolderSkeleton,
  FLDR_Skel,
} from "@/app/lib/Folder";

export default function FolderStructure({ folder_ }: { folder_: FLDR }) {
  const [folders, setFolders] = useState([folder_]);

  const handleToggleFolderOpen = (id: string) => {
    setFolders((prevFolders) => toggleFolderOpen(id, prevFolders));
  };

  const handleFetchChildFolders = async (id: string, fid: string) => {
    await fetchChildFolders(id, fid, folders, setFolders);
  };

  return (
    <div className="max-h-full overflow-y-scroll">
      {folders.map((fldr) => (
        <CollapsableFolder
          key={fldr.fid}
          folder={fldr}
          toggleFolderOpen={handleToggleFolderOpen}
          fetchChildFolders={handleFetchChildFolders}
        />
      ))}
    </div>
  );
}

export function FolderStructureSkeleton() {
  let folders: FLDR_Skel[] = [
    {
      id: "BSHaA",
      children: [
        { id: "Vawmxz", children: [], files: [] },
        { id: "tvmwj", children: [], files: [] },
        { id: "ILK", children: [], files: [] },
        { id: "ghibuM", children: [], files: [] },
      ],
      files: [],
    },
    {
      id: "zEhd",
      children: [{ id: "bmyiGC", children: [], files: [] }],
      files: [],
    },
    { id: "gBm", children: [], files: [] },
  ];

  return (
    <div className="max-h-full overflow-y-scroll">
      {folders.map((fldr) => (
        <CollapsableFolderSkeleton key={fldr.id} folder={fldr} />
      ))}
    </div>
  );
}
