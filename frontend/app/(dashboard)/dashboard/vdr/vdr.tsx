import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  // Ellipsis,
  Pen,
  File,
  Star,
  FileText,
  FileType,
  Presentation,
  FileSpreadsheet,
  Image,
  Filter,
  CalendarIcon,
  // FolderPen,
  PlusIcon,
  TimerReset,
  CheckIcon,
  FolderOpen,
  FolderIcon,
  FileIcon,
  ArrowLeft,
  Plus,
} from "lucide-react";
import React, { useEffect, useMemo, useRef } from "react";
import ViewFile from "./viewFile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectLabel,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X, Download, Trash2, Eye, Share2, Copy } from "lucide-react";
import { Grid, List } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { startOfWeek, endOfWeek, subWeeks } from "date-fns";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";
import { cn } from "@/lib/utils";

import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Backend_URL } from "@/lib/Constants";
import { useSession } from "next-auth/react";
import "quill/dist/quill.snow.css";

import CommentBox from "./CommentBox";
interface VdrProps {
  path: string;
  entityName: string;
}
interface FileData {
  id: number;
  fileName: string;
  owner: string;
  size: number;
  comments: number;
  url: string;
  path: string;
  date: string;
  bookmarked: boolean;
}
export const getFileIcon = (fileName: string) => {
  const extension = fileName.split(".").pop()?.toLowerCase();

  switch (extension) {
    case "pdf":
      return <FileText className="h-4 w-4 text-red-500" />;
    case "doc":
    case "docx":
      return <FileType className="h-4 w-4 text-blue-500" />;
    case "ppt":
    case "pptx":
      return <Presentation className="h-4 w-4 text-orange-500" />;
    case "xls":
    case "xlsx":
    case "csv":
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    case "png":
    case "jpg":
    case "jpeg":
    case "gif":
      return <Image className="h-4 w-4 text-purple-500" />;
    default:
      return <File className="h-4 w-4 text-yellow-500" />;
  }
};

export default function Vdr({ path, entityName }: VdrProps) {
  const [fileDataList, setFileDataList] = React.useState<FileData[]>([]);

  const [selectedRows, setSelectedRows] = React.useState<number[]>([]);

  const [uploadDialog, setUploadDialog] = React.useState<boolean>(false);
  const [searchTerm, setSearchTerm] = React.useState<string>("");
  const [selectedOwner, setSelectedOwner] = React.useState<string>("All");
  const [selectedFileType, setSelectedFileType] = React.useState<string>("All");

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const [fileSize, setFileSize] = React.useState<any>(
    '{ "min": 0, "max": -1 }'
  );
  const [showDeleteDialog, setShowDeleteDialog] = React.useState({
    open: false,
    Id: "",
  });
  const [showDeleteManyDialog, setShowDeleteManyDialog] = React.useState(false);
  const [showRenameDialog, setShowRenameDialog] = React.useState({
    open: false,
    Id: "",
    content: "",
  });
  const [showViewFile, setShowViewFile] = React.useState({
    open: false,
    Id: "",
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isSortedByRecent, setIsSortedByRecent] = React.useState(false);
  const [showFavorites, setShowFavorites] = React.useState(false);
  const pasteAreaRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();

  const { toast } = useToast();

  const handleFavoriteClick = () => {
    setShowFavorites(!showFavorites);
  };
  const user = session?.user?.name ? session?.user?.name : "";
  const handleRowSelect = (id: number) => {
    if (selectedRows)
      setSelectedRows((prevSelectedRows) => {
        if (prevSelectedRows.includes(id)) {
          return prevSelectedRows.filter((rowId) => rowId !== id);
        } else {
          return [...prevSelectedRows, id];
        }
      });
    if (selectedRows.length === 0) {
    }
  };
  const handleRecentClick = () => {
    setIsSortedByRecent(!isSortedByRecent);
  };

  const handleCopy = (id: number) => {
    const fileData = fileDataList.find((file) => file.id === id);
    if (fileData) {
      const fileContent = `${fileData.fileName},${fileData.owner},${fileData.size},${fileData.url},${fileData.path},${fileData.date},${fileData.bookmarked}`;
      navigator.clipboard.writeText(fileContent).then(
        () => {
          toast({
            title: `${fileData.fileName} has been succesfully copied`,
            description: "File was copied successfully.",
          });
        },
        (err) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: "There was an issue copying the file.",
          });
        }
      );
    }
  };
  const handleMultiCopy = (ids: number[]) => {
    if (ids.length === 1) {
      handleCopy(ids[0]);
      return;
    }

    const selectedFiles = fileDataList.filter((file) => ids.includes(file.id));
    const fileContents = selectedFiles.map(
      (file) =>
        `${file.fileName},${file.owner},${file.size},${file.url},${file.path},${file.date},${file.bookmarked}`
    );
    const copyContent = fileContents.join("\n");
    navigator.clipboard.writeText(copyContent).then(
      () => {
        toast({
          title: `Files have been succesfully copied`,
          description: "Files were copied successfully.",
        });
      },
      (err) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an issue copying the files.",
        });
      }
    );
  };
  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const text = event.clipboardData.getData("text/plain");
    const User = session?.user?.name ? session?.user?.name : user;
    if (text) {
      const lines = text.split("\n");

      const pastedFiles: any = lines.map((line) => {
        const [fileName, owner, size, url, Path, date, bookmarked] =
          line.split(",");

        const currentDate = new Date().toISOString();

        console.log("abc");
        return {
          fileName,
          owner: User,
          size: size,
          url,
          path: path,
          date: currentDate,
          bookmarked: "false",
        };
      });
      try {
        for (const file of pastedFiles) {
          const response = await fetch(Backend_URL + "/vdr" + "/copy", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(file),
          });

          if (!response.ok) {
            console.error("Failed to copy file:", file);
          }
        }
      } catch (error) {
        console.error("Error occurred while copying files:", error);
      }
      fetchFile();

      navigator.clipboard
        .writeText("")
        .then(() => {
          console.log("Clipboard cleared");
        })
        .catch((error) => {
          console.error("Failed to clear clipboard:", error);
        });
    }
  };

  const getFileIconLarge = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    const iconClasses = "w-1/2 h-1/2";

    switch (extension) {
      case "pdf":
        return <FileText className={`${iconClasses} text-red-500`} />;
      case "doc":
      case "docx":
        return <FileType className={`${iconClasses} text-blue-500`} />;
      case "ppt":
      case "pptx":
        return <Presentation className={`${iconClasses} text-orange-500`} />;
      case "xls":
      case "xlsx":
      case "csv":
        return <FileSpreadsheet className={`${iconClasses} text-green-500`} />;
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
        return <Image className={`${iconClasses} text-purple-500`} />;
      default:
        return <File className={`${iconClasses} text-yellow-500`} />;
    }
  };
  const filterFileData = (fileData: FileData[], searchTerm: string) => {
    let filteredFileData = fileData;

    if (searchTerm !== "") {
      filteredFileData = filteredFileData.filter((item) => {
        const fileNameWithoutExtension = item.fileName
          .split(".")
          .slice(0, -1)
          .join(".");
        return fileNameWithoutExtension
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    }

    if (selectedOwner !== "" && selectedOwner !== "All") {
      filteredFileData = filteredFileData.filter(
        (item) => item.owner === selectedOwner
      );
    }
    if (selectedFileType !== "" && selectedFileType !== "All") {
      filteredFileData = filteredFileData.filter(
        (item) =>
          item.fileName.split(".").pop()?.toLowerCase() === selectedFileType
      );
    }

    if (date?.from !== undefined && date?.to !== undefined) {
      filteredFileData = filteredFileData.filter((item) => {
        const fileDate = new Date(item.date);
        fileDate.setHours(0, 0, 0, 0);
        const fromDate = new Date(date.from ?? 0);
        fromDate.setHours(0, 0, 0, 0);
        const toDate = new Date(date.to ?? 0);
        toDate.setHours(0, 0, 0, 0);
        return fileDate >= fromDate && fileDate <= toDate;
      });
    }

    const allowedSize = JSON.parse(fileSize);
    filteredFileData = filteredFileData.filter((item) => {
      return (
        Math.trunc(item.size / 1024) >= allowedSize.min &&
        (Math.trunc(item.size / 1024) < allowedSize.max ||
          allowedSize.max === -1)
      );
    });
    if (isSortedByRecent) {
      filteredFileData = [...filteredFileData].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }
    if (showFavorites) {
      filteredFileData = filteredFileData.filter((item) => item.bookmarked);
    }
    return filteredFileData;
  };
  const downloadFile = async (id: string, fileName: string) => {
    try {
      const response = await fetch(Backend_URL + `/vdr/${id}/download`);
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      console.log(response);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Files Downloaded successfully",
        description: "Files succesfully downloaded",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue downloading the files.",
      });
      console.error("Error downloading file:", error);
    }
  };
  const selectedFileInfo = useMemo(() => {
    if (selectedRows.length === 0 || fileDataList === undefined) {
      return null;
    }

    const selectedFile = fileDataList.find(
      (file) => file.id === selectedRows[0]
    );
    return selectedFile ? selectedFile : null;
  }, [selectedRows]);
  const fetchFile = async () => {
    try {
      setIsLoading(true);
      // const response = await fetch(Backend_URL + "/vdr", {
      //   method: "GET",
      // });
      const response = await fetch(
        `${Backend_URL}/vdr?path=${encodeURIComponent(path)}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const data = await response.json();

        setFileDataList(data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };
  const deleteFile = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(Backend_URL + "/vdr/" + id, {
        method: "DELETE",
      });
      if (response.ok) {
        setFileDataList((prevList) =>
          prevList.filter((file) => file.id !== Number(id))
        );
        setSelectedRows((prev) => prev.filter((ids) => ids != Number(id)));
        setIsLoading(false);
        toast({
          title: "File Deleted successfully",
          description: "File succesfully Deleted",
        });
        setShowDeleteDialog({ open: false, Id: "" });
      } else {
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an issue deleting the file.",
        });
        setShowDeleteDialog({ open: false, Id: "" });
      }
    } catch (error) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue deleting the file.",
      });
      setShowDeleteDialog({ open: false, Id: "" });
    }
  };
  const deleteMany = async () => {
    if (selectedRows.length === 1) {
      await deleteFile(selectedRows[0].toString());
      setSelectedRows([]);
      setShowDeleteManyDialog(false);
    }
    try {
      setIsLoading(true);

      const deletePromises = selectedRows.map((id) =>
        fetch(Backend_URL + "/vdr/" + id, {
          method: "DELETE",
        })
      );

      const responses = await Promise.all(deletePromises);

      const allSuccessful = responses.every((response) => response.ok);

      if (allSuccessful) {
        setFileDataList((prevList) =>
          prevList.filter((file) => !selectedRows.includes(file.id))
        );
        setSelectedRows([]);
        setShowDeleteManyDialog(false);
      }
      toast({
        title: "Files Deleted successfully",
        description: "Files succesfully Deleted",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue deleting the files.",
      });
      console.error("Error deleting files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadMany = async () => {
    if (selectedRows.length === 1) {
      const fileName = fileDataList.find((file) => file.id === selectedRows[0])
        ?.fileName;

      await downloadFile(selectedRows[0].toString(), fileName ?? "");

      return;
    }
    const zip = new JSZip();

    for (const id of selectedRows) {
      const file = fileDataList.find((file) => file.id === id);
      if (file) {
        try {
          const response = await fetch(Backend_URL + `/vdr/${id}/download`);
          if (!response.ok) {
            throw new Error("Failed to download file");
          }
          const blob = await response.blob();
          zip.file(file.fileName, blob);
        } catch (error) {
          console.error("Error downloading file:", error);
        }
      }
    }

    try {
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(zipBlob, "selected_files.zip");
      toast({
        title: "Files Downloaded successfully",
        description: "Files succesfully downloaded as a zip file",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue downloading the files.",
      });
      console.error("Error generating ZIP:", error);
    }
  };
  const renameFile = async (id: string) => {
    try {
      setIsLoading(true);
      const fileToRename = fileDataList.find((file) => file.id === Number(id));
      if (fileToRename) {
        const fileExtension = fileToRename.fileName.split(".").pop() || "";
        const newFileName = `${showRenameDialog.content}.${fileExtension}`;
        const response = await fetch(Backend_URL + "/vdr/" + id + "/rename", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ fileName: newFileName }),
        });
        if (response.ok) {
          setFileDataList((prevList) =>
            prevList.map((file) => {
              if (file.id === Number(id)) {
                return { ...file, fileName: newFileName };
              }
              return file;
            })
          );
          setIsLoading(false);
          setShowRenameDialog({ open: false, Id: "", content: "" });
          toast({
            title: "File Renamed successfully",
            description: "File was succesfully Renamed",
          });
        } else {
          setIsLoading(false);
          setShowRenameDialog({ open: false, Id: "", content: "" });
        }
      } else {
        setIsLoading(false);
        setShowRenameDialog({ open: false, Id: "", content: "" });
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an issue downloading the files.",
        });
      }
    } catch (error) {
      setIsLoading(false);
      setShowRenameDialog({ open: false, Id: "", content: "" });
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue downloading the files.",
      });
    }
  };

  const handleSubmit = async (event: any) => {
    setUploadDialog(false);
    setIsLoading(true);
    event.preventDefault();
    console.log(user);
    const file = event.target.file.files[0];
    // const user = session?.user?.name ? session?.user?.name : "";
    // console.log(session?.user);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("owner", user);
    formData.append("path", path);
    formData.append("bookmarked", "false");
    formData.append("size", file.size);
    formData.append("date", new Date().toISOString());

    try {
      const response = await fetch(Backend_URL + "/vdr" + "/create", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchFile();
      } else {
      }
    } catch (error) {}
  };

  const handleRowBookmark = async (id: number) => {
    try {
      console.log(fileDataList);
      setFileDataList((prevData) =>
        prevData.map((file) =>
          file.id === id
            ? {
                ...file,
                bookmarked: file.bookmarked ? false : true,
              }
            : file
        )
      );

      const response = await fetch(
        Backend_URL + "/vdr/" + id + "/toggle-bookmark",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to toggle bookmark");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);

      setFileDataList((prevData) =>
        prevData.map((file) =>
          file.id === id
            ? {
                ...file,
                bookmarked: file.bookmarked ? false : true,
              }
            : file
        )
      );
    }
  };
  const handleBookmarkAll = async () => {
    try {
      setIsLoading(true);

      const allBookmarked = filteredFileData.every((file) => file.bookmarked);

      if (allBookmarked) {
        const unbookmarkIds = filteredFileData.map((file) => file.id);

        for (const id of unbookmarkIds) {
          await handleRowBookmark(id);
        }
        setIsLoading(false);
      } else {
        const bookmarkIds = filteredFileData
          .filter((file) => !file.bookmarked)
          .map((file) => file.id);

        for (const id of bookmarkIds) {
          await handleRowBookmark(id);
        }
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error toggling bookmarks:", error);
      setIsLoading(false);
    }
  };
  const handleMultiSelectChange = (checked: any) => {
    if (checked) {
      setSelectedRows(filteredFileData.map((fileData, index) => fileData.id));
    } else {
      setSelectedRows([]);
    }
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };
  const filteredFileData = filterFileData(fileDataList, searchTerm);
  const uniqueOwners = Array.from(
    new Set(fileDataList.map((file) => file.owner))
  );

  const uniqueFileTypes = Array.from(
    new Set(
      fileDataList.map(
        (file) => file.fileName.split(".").pop()?.toLowerCase() || ""
      )
    )
  );

  const sizeOptions = [
    { label: "Empty(0 kb)", value: '{"min": 0, "max": 0}' },
    { label: "Tiny(0-16kb)", value: '{"min": 0, "max": 16}' },
    { label: "Small(16kb-1mb)", value: '{"min": 16, "max": 1024}' },
    { label: "Medium(1-128mb)", value: '{"min": 1024, "max": 131072}' },
    { label: "Large(128mb-1gb)", value: '{"min": 131072, "max": 1048576}' },
    { label: "Huge(1-4gb)", value: '{"min": 1048576, "max": 4194304}' },
    { label: "Gigantic(>4gb)", value: '{"min": 4194304, "max": -1}' },
  ];
  useEffect(() => {
    const handlePasteGlobal = (event: ClipboardEvent) => {
      console.log(user);
      if (!(event.target as HTMLElement).closest(".comment-box")) {
        event.preventDefault();

        handlePaste(event as unknown as React.ClipboardEvent<HTMLDivElement>);
      }
    };

    document.addEventListener("paste", handlePasteGlobal);

    fetchFile();

    return () => {
      document.removeEventListener("paste", handlePasteGlobal);
    };
  }, []);

  if (isLoading) return "Loading...";
  return (
    <ScrollArea className="h-full">
      <div className="w-full flex flex-col" ref={pasteAreaRef}>
        <header className="w-full bg-gray-100 p-4 flex items-center justify-between">
          <div className="flex items-center justify-between w-full">
            <h1 className="text-l font-semibold">{path}</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="ml-5 h-6 w-6" />
            </Button>
          </div>
        </header>
        <div className=" w-full flex  flex-grow m-2">
          <div className="w-[12%] mr-2">
            <div className=" bg-gray-100   rounded-md ">
              <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1" className="!border-b-0">
                  <AccordionTrigger className="hover:no-underline !important text-l ml-3 py-2 !important">
                    Shortcuts
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 !important">
                    <div className="flex flex-col ">
                      <Button
                        variant="ghost"
                        className={`w-full text-l justify-start hover:bg-gray-300 `}
                        onClick={handleRecentClick}
                      >
                        <TimerReset className="h-5 w-5 text-gray-500 mr-1" />
                        <span>Recent</span>
                        {isSortedByRecent && (
                          <CheckIcon className="h-5 w-5 text-gray-500 ml-1" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        className={`w-full  text-l justify-start hover:bg-gray-300`}
                        onClick={handleFavoriteClick}
                      >
                        <Star className="h-5 w-5 text-gray-500 mr-1" />
                        <span>Favorite</span>

                        {showFavorites && (
                          <CheckIcon className="h-6 w-6 text-gray-500 ml-2" />
                        )}
                      </Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            <div className="bg-gray-100 rounded-md mt-4">
              <Accordion type="single" collapsible defaultValue="item-2">
                <AccordionItem value="item-2" className="!border-b-0 ">
                  <AccordionTrigger className="hover:no-underline !important text-l ml-3 py-2 !important">
                    Index
                  </AccordionTrigger>
                  <AccordionContent className="pb-0 !important">
                    <div className="flex flex-col">
                      {path
                        .split(">")
                        .slice(1)
                        .map((folder, index, arr) => (
                          <div
                            key={index}
                            className={`flex items-center w-full text-xs !important  ${
                              index !== arr.length - 1
                                ? "bg-gray-300"
                                : " bg-gray-100"
                            }`}
                          >
                            {index === 0 ? (
                              <FolderIcon className="h-4 w-4 mr-2 ml-3" />
                            ) : index === arr.length - 1 ? (
                              <FileIcon className="h-4 w-4 mr-2 ml-9 mt-2" />
                            ) : (
                              <FolderOpen
                                className={`h-4 w-4 mr-2 ${
                                  index === 1 ? "ml-5 " : "ml-7"
                                }`}
                              />
                            )}
                            <span
                              className={`w-full   ${
                                index === 0
                                  ? "font-bold  "
                                  : index === arr.length - 1
                                  ? "mt-2 "
                                  : ""
                              }`}
                            >
                              {folder}
                            </span>
                          </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <div className=" w-[88%] pr-6 ">
            <div className="flex flex-col  bg-gray-100 p-2  rounded-md ">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-gray-600 text-lg mr-4">
                    Attachments:{" "}
                    <span className="bg-gray-300 text-gray-600 px-4 py-1 rounded-full">
                      {entityName + " "}({fileDataList.length})
                    </span>
                  </span>
                </div>
              </div>
              {selectedRows.length === 0 ? (
                <div className="flex items-center justify-between mt-2">
                  <div
                    className={` flex items-center  ${
                      fileDataList.length === 0 ? "invisible" : ""
                    }`}
                  >
                    <div className="relative flex items-center">
                      <Input
                        type="search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-lg bg-background pl-8  focus:border-transparent h-[36px] mb-[4px]"
                      />
                    </div>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex h-[36px] ml-[20px] mb-[4px]"
                        >
                          <Filter className="mr-2 h-4 w-4" />
                          Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[250px] mt-[6.8vh]">
                        <SheetHeader>
                          <SheetTitle>Filters</SheetTitle>
                          <SheetDescription>
                            Filter data from here
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid gap-8 py-4">
                          <div className="grid grid-cols-1">
                            <Select
                              value={selectedOwner}
                              onValueChange={setSelectedOwner}
                            >
                              <SelectTrigger className="w-full h-[40px]">
                                <SelectValue placeholder="Owner" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Owner</SelectLabel>
                                  <SelectItem value="All">
                                    All Owners
                                  </SelectItem>
                                  {uniqueOwners.map((owner, index) => (
                                    <SelectItem value={owner} key={index}>
                                      {owner}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-1">
                            <Select
                              value={selectedFileType}
                              onValueChange={setSelectedFileType}
                            >
                              <SelectTrigger className="w-full h-[40px]">
                                <SelectValue placeholder="FileType" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Type</SelectLabel>
                                  <SelectItem value="All">All Type </SelectItem>
                                  {uniqueFileTypes.map((fileType, index) => (
                                    <SelectItem value={fileType} key={index}>
                                      <div className="flex items-center">
                                        {getFileIcon(fileType)}
                                        <span className="ml-2">{fileType}</span>
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-1">
                            <Select
                              value={fileSize}
                              onValueChange={setFileSize}
                            >
                              <SelectTrigger className="w-full h-[40px]">
                                <SelectValue placeholder="FileSize" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>Size</SelectLabel>
                                  <SelectItem value='{ "min": 0, "max": -1 }'>
                                    All Size
                                  </SelectItem>
                                  {sizeOptions.map((size, index) => (
                                    <SelectItem value={size.value} key={index}>
                                      {size.label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-1">
                            <div className={cn("grid gap-2")}>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    id="date"
                                    variant={"outline"}
                                    className={cn(
                                      "max-w-[250px] h-[40px] justify-start text-left font-normal text-xs px-2",
                                      !date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-1 h-4 w-4" />
                                    <span className="flex-1 text-left">
                                      {date?.from ? (
                                        date.to ? (
                                          <>
                                            {format(date.from, "LLL dd, y")} -{" "}
                                            {format(date.to, "LLL dd, y")}
                                          </>
                                        ) : (
                                          format(date.from, "LLL dd, y")
                                        )
                                      ) : (
                                        "Pick a date"
                                      )}
                                    </span>
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <div className="flex justify-between px-4 py-2">
                                    <button
                                      className={`text-sm font-medium ${
                                        date?.from?.getTime() ===
                                          startOfDay(new Date()).getTime() &&
                                        date?.to?.getTime() ===
                                          endOfDay(new Date()).getTime()
                                          ? "text-primary"
                                          : "text-gray"
                                      }`}
                                      onClick={() => {
                                        const today = new Date();
                                        const startOfDayDate =
                                          startOfDay(today);
                                        const endOfDayDate = endOfDay(today);

                                        if (
                                          date?.from?.getTime() ===
                                            startOfDayDate.getTime() &&
                                          date?.to?.getTime() ===
                                            endOfDayDate.getTime()
                                        ) {
                                          setDate({
                                            from: undefined,
                                            to: undefined,
                                          });
                                        } else {
                                          setDate({
                                            from: startOfDayDate,
                                            to: endOfDayDate,
                                          });
                                        }
                                      }}
                                    >
                                      Today
                                    </button>
                                    <button
                                      className={`text-sm font-medium ${
                                        date?.from?.getTime() ===
                                          startOfDay(
                                            subDays(new Date(), 1)
                                          ).getTime() &&
                                        date?.to?.getTime() ===
                                          endOfDay(
                                            subDays(new Date(), 1)
                                          ).getTime()
                                          ? "text-primary"
                                          : "text-gray"
                                      }`}
                                      onClick={() => {
                                        const yesterday = subDays(
                                          new Date(),
                                          1
                                        );
                                        const startOfYesterdayDate =
                                          startOfDay(yesterday);
                                        const endOfYesterdayDate =
                                          endOfDay(yesterday);

                                        if (
                                          date?.from?.getTime() ===
                                            startOfYesterdayDate.getTime() &&
                                          date?.to?.getTime() ===
                                            endOfYesterdayDate.getTime()
                                        ) {
                                          setDate({
                                            from: undefined,
                                            to: undefined,
                                          });
                                        } else {
                                          setDate({
                                            from: startOfYesterdayDate,
                                            to: endOfYesterdayDate,
                                          });
                                        }
                                      }}
                                    >
                                      Yesterday
                                    </button>

                                    <button
                                      className={`text-sm font-medium ${
                                        date?.from?.getTime() ===
                                          startOfWeek(new Date()).getTime() &&
                                        date?.to?.getTime() ===
                                          endOfWeek(new Date()).getTime()
                                          ? "text-primary"
                                          : "text-gray"
                                      }`}
                                      onClick={() => {
                                        const today = new Date();
                                        const startOfWeekDate =
                                          startOfWeek(today);

                                        const endOfWeekDate = endOfWeek(today);

                                        if (
                                          date?.from?.getTime() ===
                                            startOfWeekDate.getTime() &&
                                          date?.to?.getTime() ===
                                            endOfWeekDate.getTime()
                                        ) {
                                          setDate({
                                            from: undefined,
                                            to: undefined,
                                          });
                                        } else {
                                          setDate({
                                            from: startOfWeekDate,
                                            to: endOfWeekDate,
                                          });
                                        }
                                      }}
                                    >
                                      This Week
                                    </button>
                                    <button
                                      className={`text-sm font-medium ${
                                        date?.from?.getTime() ===
                                          startOfWeek(
                                            subWeeks(new Date(), 1)
                                          ).getTime() &&
                                        date?.to?.getTime() ===
                                          endOfWeek(
                                            subWeeks(new Date(), 1)
                                          ).getTime()
                                          ? "text-primary"
                                          : "text-gray"
                                      }`}
                                      onClick={() => {
                                        const lastWeek = subWeeks(
                                          new Date(),
                                          1
                                        );
                                        const startOfLastWeekDate =
                                          startOfWeek(lastWeek);
                                        const endOfLastWeekDate =
                                          endOfWeek(lastWeek);

                                        if (
                                          date?.from?.getTime() ===
                                            startOfLastWeekDate.getTime() &&
                                          date?.to?.getTime() ===
                                            endOfLastWeekDate.getTime()
                                        ) {
                                          setDate({
                                            from: undefined,
                                            to: undefined,
                                          });
                                        } else {
                                          setDate({
                                            from: startOfLastWeekDate,
                                            to: endOfLastWeekDate,
                                          });
                                        }
                                      }}
                                    >
                                      Last Week
                                    </button>

                                    <button
                                      className={`text-sm font-medium ${
                                        date?.from?.getTime() ===
                                          startOfMonth(new Date()).getTime() &&
                                        date?.to?.getTime() ===
                                          endOfMonth(new Date()).getTime()
                                          ? "text-primary"
                                          : "text-gray"
                                      }`}
                                      onClick={() => {
                                        const today = new Date();
                                        const startOfMonthDate =
                                          startOfMonth(today);
                                        const endOfMonthDate =
                                          endOfMonth(today);

                                        if (
                                          date?.from?.getTime() ===
                                            startOfMonthDate.getTime() &&
                                          date?.to?.getTime() ===
                                            endOfMonthDate.getTime()
                                        ) {
                                          setDate({
                                            from: undefined,
                                            to: undefined,
                                          });
                                        } else {
                                          setDate({
                                            from: startOfMonthDate,
                                            to: endOfMonthDate,
                                          });
                                        }
                                      }}
                                    >
                                      This Month
                                    </button>

                                    <button
                                      className={`text-sm font-medium ${
                                        date?.from?.getTime() ===
                                          startOfMonth(
                                            subMonths(new Date(), 1)
                                          ).getTime() &&
                                        date?.to?.getTime() ===
                                          endOfMonth(
                                            subMonths(new Date(), 1)
                                          ).getTime()
                                          ? "text-primary"
                                          : "text-gray"
                                      }`}
                                      onClick={() => {
                                        const lastMonth = subMonths(
                                          new Date(),
                                          1
                                        );
                                        const startOfLastMonthDate =
                                          startOfMonth(lastMonth);
                                        const endOfLastMonthDate =
                                          endOfMonth(lastMonth);

                                        if (
                                          date?.from?.getTime() ===
                                            startOfLastMonthDate.getTime() &&
                                          date?.to?.getTime() ===
                                            endOfLastMonthDate.getTime()
                                        ) {
                                          setDate({
                                            from: undefined,
                                            to: undefined,
                                          });
                                        } else {
                                          setDate({
                                            from: startOfLastMonthDate,
                                            to: endOfLastMonthDate,
                                          });
                                        }
                                      }}
                                    >
                                      Last Month
                                    </button>
                                  </div>
                                  <Calendar
                                    initialFocus
                                    mode="range"
                                    defaultMonth={date?.from}
                                    selected={date}
                                    onSelect={setDate}
                                    numberOfMonths={2}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </div>
                        <SheetFooter>
                          <SheetClose asChild />
                        </SheetFooter>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <div className="ml-1 mr-1 mb-1 ">
                    <Button
                      variant="outline"
                      onClick={() => setUploadDialog(true)}
                    >
                      Add File{" "}
                      <span>
                        <PlusIcon className="h-4 w-4 text-gray-600 ml-1" />
                      </span>
                    </Button>
                  </div>
                  <div className="flex items-center">
                    <List className="h-4 w-4 text-gray-600 mr-2" />

                    <Switch>
                      <span className="sr-only">
                        Toggle between grid and list view
                      </span>
                    </Switch>
                    <Grid className="h-4 w-4 text-gray-600 ml-2" />
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center mt-4  mb-2">
                  <div className="w-full flex justify-start">
                    <button
                      onClick={() => setSelectedRows([])}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <X className="h-5 w-5 mr-2" />
                    </button>
                    <span className="text-gray-600 mr-3 ">
                      {selectedRows.length} selected
                    </span>
                    <button
                      className="flex items-center text-gray-600 hover:text-gray-800"
                      onClick={() => downloadMany()}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      <span className="mr-3">Download</span>
                    </button>
                    <button
                      className="flex items-center text-gray-600 hover:text-gray-800"
                      onClick={() => {
                        setShowDeleteManyDialog(true);
                      }}
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      <span className="mr-3">Delete</span>
                    </button>

                    {selectedRows.length === 1 && (
                      <button
                        className="flex items-center text-gray-600 hover:text-gray-800"
                        onClick={() => {
                          setShowViewFile({
                            open: true,
                            Id: selectedRows.toString(),
                          });
                        }}
                      >
                        <Eye className="h-5 w-5 mr-2" />
                        <span className="mr-3">View</span>
                      </button>
                    )}
                    <button className="flex items-center text-gray-600 hover:text-gray-800">
                      <Share2 className="h-5 w-5 mr-2" />
                      <span className="mr-3">Share</span>
                    </button>
                    <button
                      className="flex items-center text-gray-600 hover:text-gray-800"
                      onClick={() => {
                        handleMultiCopy(selectedRows);
                      }}
                    >
                      <Copy className="h-5 w-5 mr-2" />
                      <span className="mr-3">Copy</span>
                    </button>
                    <button className="flex items-center text-gray-600 hover:text-gray-800">
                      <Icons.ellipsis className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
            {fileDataList.length > 0 && (
              <div className="w-full flex ">
                <div className="mt-4 rounded-md border w-[70%] min-w-[70%] h-fit ">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[5%]">
                          <Checkbox
                            checked={
                              selectedRows.length === filteredFileData.length &&
                              filteredFileData.length !== 0
                            }
                            onCheckedChange={(checked) =>
                              handleMultiSelectChange(checked)
                            }
                          />
                        </TableHead>
                        <TableHead className="w-[5%] align-center">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  onClick={handleBookmarkAll}
                                  className={`bookmark-all  transition-colors`}
                                >
                                  <Star
                                    fill={
                                      filteredFileData.every(
                                        (file) => file.bookmarked
                                      ) && filteredFileData.length !== 0
                                        ? "gold"
                                        : "none"
                                    }
                                    className={"h6 w-6 text-gray-500"}
                                  />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Mark all Files as favourite</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableHead>
                        <TableHead className="w-[20%]">File Name</TableHead>
                        <TableHead className="w-[16%] text-center ">
                          <span>Comments</span>
                        </TableHead>
                        <TableHead className="w-[16%]">Owner</TableHead>
                        <TableHead className="w-[16%]">Size</TableHead>
                        <TableHead className="w-[16%]">Date</TableHead>
                        <TableHead className="text-center w-[6%]">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Icons.ellipsis className="h-4 w-4" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>More Actions</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFileData.map((fileData, index) => (
                        <TableRow
                          key={index}
                          onClick={(event) => {
                            if (
                              !(event.target as Element).closest(
                                "[data-has-click-handler]"
                              )
                            ) {
                              handleRowSelect(fileData.id);
                            }
                          }}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedRows.includes(fileData.id)}
                              onCheckedChange={() =>
                                handleRowSelect(fileData.id)
                              }
                              data-has-click-handler
                            />
                          </TableCell>
                          <TableCell className="align-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    onClick={() =>
                                      handleRowBookmark(fileData.id)
                                    }
                                    data-has-click-handler
                                  >
                                    <Star
                                      fill={
                                        fileData.bookmarked === true
                                          ? "gold"
                                          : "none"
                                      }
                                      className="h-6 w-6 text-gray-500"
                                    />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Mark your File as favourite</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className=" max-w-0  ">
                            <div className="flex items-center space-x-2">
                              {getFileIcon(fileData.fileName)}
                              <span className="truncate w-full">
                                {fileData.fileName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className=" text-center">
                            {fileData.comments}
                          </TableCell>
                          <TableCell className=" max-w-0  ">
                            <div className="flex items-center ">
                              <span className="truncate w-full">
                                {fileData.owner}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {(fileData.size / 1024).toFixed(1)} Kb
                          </TableCell>
                          <TableCell>{formatDate(fileData.date)}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <button className="text-gray-500 hover:text-gray-700">
                                  <span className="sr-only">Open</span>
                                  <Icons.ellipsis className="h-4 w-4" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent data-has-click-handler>
                                <DropdownMenuItem
                                  onClick={() =>
                                    downloadFile(
                                      fileData.id.toString(),
                                      fileData.fileName
                                    )
                                  }
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  <span>Download</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setShowDeleteDialog({
                                      open: true,
                                      Id: fileData.id.toString(),
                                    })
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  <span>Delete</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    setShowViewFile({
                                      open: true,
                                      Id: fileData.id.toString(),
                                    })
                                  }
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  <span>View</span>
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                  <Share2 className="h-4 w-4 mr-2" />
                                  <span>Share</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleCopy(fileData.id)}
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  <span>Copy</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setShowRenameDialog({
                                      open: true,
                                      Id: fileData.id.toString(),
                                      content: "",
                                    })
                                  }
                                >
                                  <Pen className="h-4 w-4 mr-2" />
                                  <span>Rename</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 ml-2 w-[30%]   ">
                  {selectedFileInfo && selectedRows.length === 1 ? (
                    <div className="bg-gray-100 p-2 rounded-lg w-full">
                      <h3 className="text-xl font-semibold">Information</h3>

                      <div className="flex items-center justify-center">
                        {getFileIconLarge(selectedFileInfo.fileName)}
                      </div>

                      <div className="flex flex-col space-y-2 ">
                        <div className="flex   ">
                          <span className="w-28 font-semibold ">File Name</span>
                          <span className="mr-2 font-semibold">:</span>
                          <span className="truncate max-w-[calc(100%-8rem)]  ">
                            {selectedFileInfo.fileName}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="w-28 font-semibold">Owner</span>
                          <span className="mr-2 font-semibold ">:</span>
                          <span className="truncate max-w-[calc(100%-8rem)]">
                            {selectedFileInfo.owner}
                          </span>
                        </div>
                        <div className="flex ">
                          <span className="w-28 font-semibold">Date</span>
                          <span className="mr-2 font-semibold ">:</span>
                          <span className="truncate max-w-[calc(100%-8rem)]">
                            {formatDate(selectedFileInfo.date)}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="w-28 font-semibold">Size</span>
                          <span className="mr-2 font-semibold ">:</span>
                          <span className="truncate max-w-[calc(100%-8rem)]">
                            {(selectedFileInfo.size / 1024).toFixed(1)} Kb
                          </span>
                        </div>

                        <div className="flex flex-col w-full">
                          <div className="flex">
                            <span className="w-28 font-semibold">Comments</span>
                            <span className="mr-2 font-semibold ">:</span>
                          </div>
                          <CommentBox
                            fileId={selectedFileInfo.id}
                            setFileDataList={setFileDataList}
                            className="comment-box"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 p-2 rounded-lg w-full">
                      <h3 className="text-xl font-semibold">Information</h3>
                    </div>
                  )}
                </div>
              </div>
            )}
            <Dialog open={uploadDialog}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Upload File</DialogTitle>
                </DialogHeader>
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Input id="file" type="file" />
                  </div>

                  <div className="flex items-center justify-between">
                    <a
                      onClick={() => setUploadDialog(false)}
                      className="cursor-pointer bg-gray-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </a>
                    <button
                      type="submit"
                      className=" bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <ViewFile
              open={showViewFile.open}
              Id={showViewFile.Id}
              setShowViewFile={setShowViewFile}
              fileDataList={fileDataList}
              downloadFile={downloadFile}
              deleteFile={deleteFile}
            />

            <Dialog open={showRenameDialog.open}>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Rename File</DialogTitle>
                </DialogHeader>

                <div className="grid w-full max-w-sm items-center gap-1.5 relative">
                  <Input
                    type="text"
                    value={showRenameDialog.content}
                    onChange={(e) => {
                      setShowRenameDialog((prevState) => ({
                        ...prevState,
                        content: e.target.value,
                      }));
                    }}
                    className="pr-16"
                  />
                  <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {`.${
                      fileDataList
                        .find((file) => file.id === Number(showRenameDialog.Id))
                        ?.fileName.split(".")
                        .pop() || ""
                    }`}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <a
                    onClick={() =>
                      setShowRenameDialog({ open: false, Id: "", content: "" })
                    }
                    className="cursor-pointer bg-gray-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Cancel
                  </a>
                  <button
                    className=" bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      renameFile(showRenameDialog.Id);
                    }}
                    disabled={!showRenameDialog.content.trim()}
                  >
                    Save
                  </button>
                </div>
              </DialogContent>
            </Dialog>
            <AlertDialog open={showDeleteDialog.open}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you sure want to delete this File?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setShowDeleteDialog({ open: false, Id: "" })}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    variant="destructive"
                    onClick={() => deleteFile(showDeleteDialog.Id)}
                  >
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={showDeleteManyDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {selectedRows.length > 1
                      ? `Are you sure you want to delete ${selectedRows.length} files?`
                      : "Are you sure you want to delete this file?"}
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    onClick={() => setShowDeleteManyDialog(false)}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <Button variant="destructive" onClick={() => deleteMany()}>
                    Delete
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
