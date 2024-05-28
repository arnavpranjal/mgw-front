"use client";

import { Button } from "@/components/ui/button";

import React from "react";
const FileButton = ({
  accept,
  onChange,
}: {
  accept?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const [fileName, setFileName] = React.useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setFileName(file ? file.name : "");
    onChange(e);
  };

  return (
    <label
      htmlFor="file-input"
      className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer"
    >
      {"Browse File"}
      <input
        id="file-input"
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
  );
};

export default function InsertImage({
  setShowInsertImageDialog,
  updateLogo,
}: {
  setShowInsertImageDialog: any;
  updateLogo: any;
}) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleSaveClick = () => {
    updateLogo(selectedFile);
    setShowInsertImageDialog(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const isImage = file.type.startsWith("image/");
    if (isImage) {
      setSelectedFile(file);
      setIsDragOver(false);
    } else {
      console.error("Only non-image files are allowed.");
    }
  };
  return (
    <div className="h-full">
      <div className="flex flex-col w-full justify-center items-center h-[90%] ">
        <div
          onDragOver={handleDragOver}
          className={`flex flex-col justify-center items-center h-[80%] w-[80%] rounded-[10px] border-[2px] ${
            selectedFile ? "border-blue-800  " : "border-gray-400 "
          } ${selectedFile ? "bg-stone-300" : ""}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-[250px] flex flex-col items-center justify-between">
            <div className="mb-2 font-bold text-xl">
              Drag and Drop to Upload
            </div>
            <div className="mx-2 mb-2 font-bold text-xl">Or</div>
            <FileButton accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-between ">
        <Button
          variant="outline"
          onClick={() => setShowInsertImageDialog(false)}
        >
          Cancel
        </Button>
        <Button onClick={handleSaveClick} disabled={!selectedFile}>
          Save
        </Button>
      </div>
    </div>
  );
}
