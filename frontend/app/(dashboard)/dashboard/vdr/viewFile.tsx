import {
  ViewDialog,
  ViewDialogContent,
  ViewDialogHeader,
  ViewDialogTitle,
} from "./dialog";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

import React, { useEffect, useRef, useState } from "react";
import { Download, Trash2, X } from "lucide-react";
import { Backend_URL } from "@/lib/Constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ViewFile({
  open,
  Id,
  setShowViewFile,
  fileDataList,
  downloadFile,
  deleteFile,
}: any) {
  const [fileData, setFileData] = useState<any>(null);
  const [isFileLoading, setIsFileLoading] = React.useState<boolean>(false);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [progress, setProgress] = useState<number>(0);

  const fetchFileData = async (abortController: any) => {
    try {
      setIsFileLoading(true);

      setProgress(0);

      const response = await fetch(Backend_URL + `/vdr/${Id}/view`, {
        signal: abortController.signal,
      });
      const contentLength = selectedFileData.size;
      const totalLength = contentLength;

      if (response.body) {
        const reader = response.body.getReader();
        console.log(reader);
        const chunks = [];
        let receivedLength = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          receivedLength += value.length;
          console.log(receivedLength);
          setProgress(Math.round((receivedLength / totalLength) * 100));
        }

        const chunksAll = new Uint8Array(receivedLength);
        let position = 0;
        for (let chunk of chunks) {
          chunksAll.set(chunk, position);
          position += chunk.length;
        }

        const fileDataBlob = new Blob([chunksAll]);
        const fileDataBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(fileDataBlob);
        });

        setFileData(fileDataBase64);
      }

      setIsFileLoading(false);
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error fetching file data:", error);
        setIsFileLoading(false);
      }
    }
  };

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    if (open) {
      fetchFileData(abortController);
    }
  }, [Id]);
  const selectedFileData = fileDataList.find(
    (file: any) => file.id.toString() === Id
  );
  const handleExit = () => {
    setShowViewFile({ open: false, Id: "" });
    setFileData(null);
    setPageNumber(1);
    setProgress(0);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };
  const handleDelete = async () => {
    await deleteFile(selectedFileData.id.toString());
    handleExit();
  };

  const renderFileContent = () => {
    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
      setNumPages(numPages);
    }
    if (!selectedFileData) return null;

    const fileExtension = selectedFileData.fileName
      .split(".")
      .pop()
      .toLowerCase();

    switch (fileExtension) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="mt-1 mb-2 flex space-x-2">
              <Button variant="outline" className="h-8 mr-2">
                <Download
                  className=" h-4 w-4"
                  onClick={() =>
                    downloadFile(selectedFileData.id, selectedFileData.fileName)
                  }
                />
              </Button>
              <Button variant="outline" className="h-8">
                <Trash2 className=" h-4 w-4" onClick={() => handleDelete()} />
              </Button>
            </div>
            <img
              src={fileData}
              className="max-w-[calc(100%-2rem)] max-h-[calc(100%-2rem)]"
            />
          </div>
        );
      case "pdf":
        return (
          <div className="max-w-full max-h-full h-full flex flex-col items-center justify-center">
            <div className=" mt-1 mb-2 flex space-x-2">
              <Button variant="outline" className="h-8 mr-2">
                <Download
                  className=" h-4 w-4"
                  onClick={() =>
                    downloadFile(selectedFileData.id, selectedFileData.fileName)
                  }
                />
              </Button>
              <Button variant="outline" className="h-8">
                <Trash2 className=" h-4 w-4" onClick={() => handleDelete()} />
              </Button>
            </div>
            <div className=" overflow-auto  h-5/6 ">
              <Document
                file={fileData}
                onLoadSuccess={onDocumentLoadSuccess}
                className="max-w-full max-h-full"
              >
                <Page
                  pageNumber={pageNumber}
                  className="max-w-full max-h-full "
                />
              </Document>
            </div>
            <div className="mt-4  flex items-center justify-between">
              <p className="mr-[100px]">
                Page {pageNumber} of {numPages}
              </p>

              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  min={1}
                  max={numPages}
                  value={pageNumber}
                  className="w-20 h-8 text-center"
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    // if (value >= 1 && value <= numPages) {
                    //   setPageNumber(value);
                    // }
                    if (value >= 1 && value <= (numPages || 0)) {
                      setPageNumber(value);
                    } else if (value < 1) {
                      setPageNumber(1);
                    }
                  }}
                />
                <Button
                  onClick={() => setPageNumber(pageNumber - 1)}
                  disabled={pageNumber === 1}
                  variant="outline"
                  className="h-8"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setPageNumber(pageNumber + 1)}
                  disabled={pageNumber === numPages}
                  variant="outline"
                  className="h-8"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return <p>Unsupported file type</p>;
    }
  };

  return (
    <>
      <ViewDialog open={open}>
        <ViewDialogContent>
          <ViewDialogHeader>
            <ViewDialogTitle className="flex items-center justify-between">
              <span>Document view: {selectedFileData?.fileName}</span>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => handleExit()}
              >
                <X className="h-6 w-6" />
              </button>
            </ViewDialogTitle>
          </ViewDialogHeader>
          <div className="flex items-center justify-center h-[calc(100%-5rem)] mt-4">
            {isFileLoading ? (
              <div className="flex flex-col items-center">
                <div className="w-full bg-gray-200 rounded-full h-3.5">
                  <div
                    className="bg-primary h-3.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="mt-2">Loading...</p>
              </div>
            ) : (
              renderFileContent()
            )}
          </div>
        </ViewDialogContent>
      </ViewDialog>
    </>
  );
}
