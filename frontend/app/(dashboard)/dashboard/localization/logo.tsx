"use client";
import { Button } from "@/components/ui/button";

import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import InsertImage from "./insertImage";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Backend_URL } from "@/lib/Constants";
export default function Logo() {
  const [logoImage, setLogoImage] = React.useState(null);
  const [showInsertImageDialog, setShowInsertImageDialog] =
    React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const { toast } = useToast();
  const fetchLogo = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(Backend_URL+"/logo");

      setLogoImage(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching logo:", error);
    }
  };

  const uploadLogo = async (image: File) => {
    try {
      if (!image.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "File not an Image",
          description: "There was a problem with your request.",
        });
        return;
      }
      const formData = new FormData();
      formData.append("file", image);

      const response = await axios.post(
        Backend_URL+"/logo/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      fetchLogo();

      console.log("Logo uploaded successfully:", response.data);
    } catch (error) {
      console.error("Error uploading logo:", error);
    }
  };
  useEffect(() => {
    fetchLogo();
  }, []);
  if (isLoading) return "Loading...";
  return (
    <div className="flex"
    //  "items-center justify-center centered-div"
     >
      <div className="bg-gray-300 mt-1 p-6 rounded-lg logo-card shadow-md flex flex-col items-center justify-center min-w-[450px] min-h-[250px]">
        <h2 className=" font-medium  w-full text-2xl">Update Logo</h2>
        <div className="flex-1"></div>
        {logoImage && logoImage != "" ? (
          <img
            src={logoImage}
            alt="Logo"
            style={{ width: "150px", height: "60px", objectFit: "fill" }}
          />
        ) : (

         
          <img
            src="/LogoMergerware.svg"
            alt="Logo"
            style={{ width: "150px", height: "60px", objectFit: "fill" }}
          />
        )}
        <div className="flex-1"></div>
        <Button
          className="text-white font-bold py-2 px-4 rounded "
          onClick={() => setShowInsertImageDialog(true)}
        >
          Choose File
        </Button>
      </div>

      <Dialog open={showInsertImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <span className="text-2xl">Insert Image</span>
            </DialogTitle>
          </DialogHeader>
          <InsertImage
            setShowInsertImageDialog={setShowInsertImageDialog}
            updateLogo={uploadLogo}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}