"use client";

import React, { useEffect, useState } from "react";
// import QuillEditor from "./quillEditor";

import { Download, Edit, Plus, Trash, X } from "lucide-react";
import "quill/dist/quill.snow.css";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import { Backend_URL } from "@/lib/Constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "react-query";
import { fetchUsersData } from "@/components/tables/user-mangement-table/client";
import { getFileIcon } from "./vdr";
import { useToast } from "@/components/ui/use-toast";
const QuillEditor = dynamic(() => import("./quillEditor"), {
  ssr: false,
});
interface CommentBoxProps {
  fileId: number;
  setFileDataList: any;
  className: string;
}
interface ChatMessage {
  id: number;
  content: string;
  files: any;
  attachment: any;
  date: string;
  userId: number;
}

const CommentBox: React.FC<CommentBoxProps> = ({ fileId, setFileDataList }) => {
  const [content, setContent] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isError, setIsError] = useState(false);
  const { data: session } = useSession();
  const [fileBox, setFileBox] = useState<File[]>([]);
  const {
    data: users,
    error,
    isLoading,
    refetch,
  } = useQuery("users", fetchUsersData);

  const { toast } = useToast();

  const getBase64 = async (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64WithoutPrefix = base64String.split(",")[1];
        resolve(base64WithoutPrefix);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };
  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const response = await fetch(Backend_URL + `/comment?fileId=${fileId}`);
      if (response.ok) {
        const comments = await response.json();
        const updatedComments = await Promise.all(
          comments.map(async (comment: ChatMessage) => {
            if (comment.attachment && comment.attachment.files) {
              const updatedFiles = await Promise.all(
                comment.attachment.files.map(async (file: any) => {
                  if (file.fileName.match(/\.(png|jpe?g|gif)$/i)) {
                    const fileResponse = await fetch(
                      Backend_URL + `/comment/downloadFile`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ url: file.url }),
                      }
                    );
                    if (fileResponse.ok) {
                      const fileData = await fileResponse.json();
                      return { ...file, data: fileData.data };
                    }
                  }
                  return file;
                })
              );
              return {
                ...comment,
                attachment: { ...comment.attachment, files: updatedFiles },
              };
            }
            return comment;
          })
        );
        setChatMessages(updatedComments);
      } else {
        console.error("Failed to fetch comments");
        setIsError(true);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setIsError(true);
    } finally {
      setIsLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  if (isLoading || isLoadingComments) {
    return <div>Loading...</div>;
  }

  if (error || isError) {
    return <div className="text-red-500">Error Fetching Comments </div>;
  }
  const handleRemoveFile = (index: number) => {
    setFileBox((prevFileBox) =>
      prevFileBox.filter((_, i: number) => i !== index)
    );
  };

  const uploadCommentFile = async (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    console.log(file.name);

    const fileResponse = await fetch(Backend_URL + "/comment/uploadfile", {
      method: "POST",
      body: formData,
    });

    if (!fileResponse.ok) {
      throw new Error("Failed to create CommentFile");
    }

    const fileData = await fileResponse.json();

    return {
      url: fileData.url,
      fileName: file.name,
    };
  };
  const handleDeleteComment = async (commentId: number) => {
    try {
      const response = await fetch(Backend_URL + `/comment/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const updatedMessages = chatMessages.filter(
          (message) => message.id !== commentId
        );
        setChatMessages(updatedMessages);
        setContent("");
        await fetch(Backend_URL + `/vdr/${fileId}/decrease-comment`, {
          method: "PATCH",
        });
        setFileDataList((prevFileDataList: any) =>
          prevFileDataList.map((file: any) =>
            file.id === fileId ? { ...file, comments: file.comments - 1 } : file
          )
        );
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };
  const handleContentChange = (messageId: number, content: string) => {
    setChatMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId ? { ...message, content } : message
      )
    );
  };
  const handleSaveEdit = async (message: ChatMessage) => {
    try {
      const response = await fetch(Backend_URL + `/comment/${message.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: message.content }),
      });

      if (response.ok) {
        setEditingMessageId(null);
      } else {
        console.error("Failed to update comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(chatMessages);
    setIsLoadingComments(true);
    if (content.trim() !== "") {
      try {
        let attachment = null;
        if (fileBox.length > 0) {
          try {
            const uploadedFiles = await Promise.all(
              fileBox.map((file: any) => uploadCommentFile(file))
            );
            attachment = {
              files: uploadedFiles,
            };
          } catch (error) {
            console.error("Error creating CommentFile:", error);
          }
        }
        const currentDate = new Date();
        const response = await fetch(Backend_URL + "/comment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content.replace(/<p><br><\/p>$/, ""),
            userId: session?.user?.id,
            fileId: fileId,
            date: currentDate,
            attachment: attachment,
          }),
        });

        if (response.ok) {
          setContent("");
          setShowEditor(false);
        }

        const newMessage = await response.json();

        if (newMessage.attachment && newMessage.attachment.files) {
          newMessage.attachment.files = await Promise.all(
            newMessage.attachment.files
          );
        }

        if (newMessage.attachment && newMessage.attachment.files) {
          newMessage.attachment.files = await Promise.all(
            newMessage.attachment.files.map(async (file: any) => {
              if (file.fileName.match(/\.(png|jpe?g|gif)$/i)) {
                const matchingFile = fileBox.find(
                  (f: any) => f.name === file.fileName
                );
                if (matchingFile) {
                  const fileData = await getBase64(matchingFile);
                  return {
                    ...file,
                    data: fileData,
                  };
                }
              }
              return file;
            })
          );
        }

        setChatMessages([...chatMessages, newMessage]);
        setFileBox([]);

        await fetch(Backend_URL + `/vdr/${fileId}/increase-comment`, {
          method: "PATCH",
        });
        setFileDataList((prevFileDataList: any) =>
          prevFileDataList.map((file: any) =>
            file.id === fileId ? { ...file, comments: file.comments + 1 } : file
          )
        );
      } catch {
      } finally {
        setIsLoadingComments(false);
      }
    }
  };
  const deleteFile = async (Url: string, id: string) => {
    try {
      const response = await fetch(Backend_URL + `/comment/file/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: Url }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      const commentIndex = chatMessages.findIndex(
        (message) => message.id === parseInt(id)
      );

      if (commentIndex !== -1) {
        const updatedChatMessages = [...chatMessages];
        const updatedComment = { ...updatedChatMessages[commentIndex] };

        const fileIndex = updatedComment.attachment?.files.findIndex(
          (file: any) => file.url === Url
        );

        if (fileIndex !== undefined && fileIndex !== -1) {
          updatedComment.attachment?.files.splice(fileIndex, 1);

          updatedChatMessages[commentIndex] = updatedComment;

          setChatMessages(updatedChatMessages);
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue deleting the file.",
      });
      console.error("Error deleting file:", error);
    }
  };
  const downloadFile = async (Url: string, fileName: string) => {
    try {
      const response = await fetch(Backend_URL + `/comment/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: Url }),
      });
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
        title: "File Downloaded successfully",
        description: "File succesfully downloaded",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue downloading the file.",
      });
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div className="w-full comment-box">
      <div className="mt-1 w-full">
        {chatMessages.length > 0 && (
          <ScrollArea className="h-[200px] bg-gray-300 p-2  mb-1 rounded-md w-full ">
            <div className="w-full">
              {chatMessages
                .sort((a, b) => a.id - b.id)
                .map((message) => {
                  const user = users.find(
                    (user: any) => user.id === message.userId
                  );

                  return (
                    <div className="flex w-full" key={message.id}>
                      <div
                        className={`mb-2 pl-1 pr-1 rounded bg-white flex-grow shadow-md w-full `}
                      >
                        <div className="flex justify-between items-center w-full mt-1 mb-1">
                          <div className="flex items-center w-[80%]">
                            <Avatar className="h-6 w-6 mr-1 ">
                              <AvatarImage
                                src={user?.image ?? ""}
                                alt={user?.name ?? ""}
                              />
                              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div className=" flex w-[80%]">
                              <span className="font-semibold text-primary w-full truncate text-sm">
                                {message.userId === session?.user?.id
                                  ? "You"
                                  : user.name}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {message.id === editingMessageId ? (
                              <Button
                                variant="ghost"
                                className="text-gray-500 hover:text-gray-700 py-0 px-0 h-0 "
                                onClick={() => handleSaveEdit(message)}
                                disabled={session?.user?.id !== message.userId}
                              >
                                Done
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                className={`text-gray-500 hover:text-gray-700 py-0 px-0 h-0 ${
                                  session?.user?.id !== message.userId
                                    ? "hidden"
                                    : ""
                                }`}
                                onClick={() => setEditingMessageId(message.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              className={`text-gray-500 hover:text-gray-700 py-0 px-0 h-0 ${
                                session?.user?.id !== message.userId
                                  ? "hidden"
                                  : ""
                              }`}
                              onClick={() => handleDeleteComment(message.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="ql-snow">
                          {message.id === editingMessageId ? (
                            <div
                              className="ql-editor editor-padding "
                              contentEditable
                              suppressContentEditableWarning
                              onBlur={(e) =>
                                handleContentChange(
                                  message.id,
                                  e.target.innerHTML
                                )
                              }
                              dangerouslySetInnerHTML={{
                                __html: message.content,
                              }}
                            />
                          ) : (
                            <div
                              className="ql-editor editor-padding "
                              dangerouslySetInnerHTML={{
                                __html: message.content,
                              }}
                            />
                          )}
                          {message.attachment &&
                            message.attachment.files.length > 0 && (
                              <div className="flex flex-col space-y-1 ">
                                {message.attachment.files.map(
                                  (file: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex items-center space-x-2 w-[100%] p-1 bg-gray-200  mt-1 rounded-md"
                                    >
                                      <div className="flex items-center flex-col w-full ">
                                        <div className="w-full flex items-center justify-between">
                                          <div className="flex items-center w-[85%]">
                                            {getFileIcon(file?.fileName)}
                                            <span className="truncate w-[85%] ml-1">
                                              {file.fileName}
                                            </span>
                                          </div>
                                          {message.id !== editingMessageId ? (
                                            <Download
                                              className="w-5 h-5 text-gray-500 cursor-pointer"
                                              onClick={() =>
                                                downloadFile(
                                                  file.url,
                                                  file.fileName
                                                )
                                              }
                                            />
                                          ) : (
                                            <Button
                                              variant="ghost"
                                              className={`text-gray-500 hover:text-gray-700 py-0 px-0 h-0`}
                                              onClick={() =>
                                                deleteFile(
                                                  file.url,
                                                  message.id.toString()
                                                )
                                              }
                                            >
                                              <Trash className="h-4 w-4" />
                                            </Button>
                                          )}
                                        </div>

                                        {file.fileName.match(
                                          /\.(png|jpe?g|gif)$/i
                                        ) &&
                                          file.data && (
                                            <div>
                                              <img
                                                src={`data:image/png;base64,${file.data}`}
                                                alt={file.fileName}
                                                className="mt-2 max-w-full "
                                              />
                                            </div>
                                          )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                          <div className="text-right text-xs text-gray-500">
                            {new Date(message.date).toLocaleString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
        )}
      </div>
      {!showEditor && (
        <div
          className="cursor-pointer flex items-center "
          onClick={() => {
            setShowEditor(true);
          }}
        >
          <span className="mr-1 rounded-full bg-gray-300 px-2 py-1 text-black text-sm">
            Click to add a comment
          </span>
          <div className="rounded-full bg-primary h-6 w-6 flex items-center justify-center">
            <Plus className="h-4 w-4 text-white" />
          </div>
        </div>
      )}

      <div style={{ display: showEditor ? "block" : "none" }}>
        <form onSubmit={handleCommentSubmit}>
          <QuillEditor
            onContentChange={setContent}
            content={content}
            fileBox={fileBox}
            onFileBoxChange={setFileBox}
          />
          {fileBox.length > 0 && (
            <div className="flex flex-col">
              {fileBox.map((file: File, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 w-[100%] p-1 bg-gray-200  mt-1 rounded-md"
                >
                  {getFileIcon(file.name)}
                  <span className="truncate w-[80%]">{file.name}</span>
                  <X
                    className="w-6 h-6 text-gray-500 cursor-pointer"
                    onClick={() => handleRemoveFile(index)}
                  />
                </div>
              ))}
            </div>
          )}
          <div className="mt-2 flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowEditor(false);
                setContent("");
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                (content.trim() === "<p><br></p>" ||
                  content.trim() === "<p></p>") &&
                fileBox.length === 0
              }
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommentBox;
