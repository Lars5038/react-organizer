"use client";
import { FLDR } from "@/app/lib/Folder";
import FolderView from "@/app/lib/FolderView";
import { useState, useEffect, Suspense } from "react";
import { v4 as uuidv4 } from "uuid";

export default function Files() {
  const [currentFolder, setCurrentFolder] = useState<FLDR | null>(null);
  const [error, setError] = useState(null);
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const id = queryParams.get('id') || "b0ec7c6c-af54-4511-bb75-0b2a19aebd54"; // Default folder ID

    fetch(`http://localhost:3000/folders/${id}/self`, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((currFolder) => {
        if (currFolder) {
          setCurrentFolder({
            id: currFolder.id,
            fid: uuidv4(),
            name: currFolder.name,
            creationDate: currFolder.creationDate,
            modificationDate: currFolder.modificationDate,
            description: currFolder.description,
            open: 0,
            children: [],
            files: [],
            parents: [],
            size: -1
          });
        }
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
    <>
      <FolderView />
    </>
  );
}