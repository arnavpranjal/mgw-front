"use client";
import { useQuery } from "react-query";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table-base";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Groups } from "@/constants/data";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { Icons } from "../../icons";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Backend_URL } from "@/lib/Constants";
import { useToast } from "@/components/ui/use-toast";
import React from "react";

interface ProductsClientProps {
  data: Groups[];
}

export async function fetchWorkingGroup() {
  const response = await fetch(Backend_URL + "/working-group/");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export const GroupClient: React.FC<ProductsClientProps> = ({ data }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const {
    data: group,
    error,
    isLoading,
    refetch,
  } = useQuery("group", fetchWorkingGroup);

  // Handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Here you can handle the form data, like sending it to an API
    console.log(formData);

    const res = await fetch(Backend_URL + "/working-group/add/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
      }),
    });
    if (res.status == 401) {
      console.log(res.statusText);
    } else {
      const data = await res.json();
      refetch();
      setFormData({ name: "", description: "" });
      toast({
        title: "Working Group Created!",
        variant: "default",
        description: `Working Group Has Been Added Successfully!`,
      });
    }
  };

  // Handle form field changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error;

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-end-8 col-span-1 ">
          {/* <Button variant="outline" size="icon">
            <Icons.DownloadCloudIcon className="h-4 w-4" />
          </Button>
          &nbsp;
          <Button variant="outline" size="icon">
            <Icons.UploadCloudIcon className="h-4 w-4" />
          </Button>
          &nbsp; */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" >
                <Icons.add className="h-4 w-4" /> ADD
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[495px]">
              <DialogHeader>
                <DialogTitle>Add New Working Group</DialogTitle>
                {/* <DialogDescription>
                  What do you want to get done today?
                </DialogDescription> */}
              </DialogHeader>
              <div className="max-w-lg p-8 rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Working Group Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="description"
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <DialogClose asChild>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Submit
                    </button>
                  </DialogClose>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <DataTable searchKey="name" columns={columns} data={group} />
    </>
  );
};
