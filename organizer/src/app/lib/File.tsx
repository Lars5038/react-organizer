import { FileIcon, FolderIcon } from "./Icons";

export type FILE = {
  id: string;
  fid: string;
  name: string;
  creationDate: Date;
  modificationDate: Date;
  description: string | null;
  path: string;
  version: number;
  size: number;
};

export type FILE_Skel = {
    id: string;
};

export function GalleryFile({ file }: { file: FILE }) {
  // const createFolderLink = (folderId: string) => {
  //   const url = new URL(window.location.href);
  //   url.searchParams.set('id', folderId);
  //   return url.toString();
  // };

  return (
    //   <Link href={createFolderLink(folder.id)} className="w-32 h-auto flex flex-col group">
    <div className="w-32 h-auto flex flex-col group">
      <FileIcon
        className={
          "w-full text-center fill-gray-700 pr-1 group-hover:fill-gray-600"
        }
      ></FileIcon>
      <p className="w-full text-center text-gray-300 group-hover:text-gray-100">
        {file.name}
      </p>
    </div>
    // </Link>
  );
}
