"use client";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { Groups } from "@/constants/data";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "../../icons";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Backend_URL } from "@/lib/Constants";

import { useQuery } from "react-query";
import { fetchWorkingGroup } from "./client";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const columns: ColumnDef<Groups>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: true,
  //   enableHiding: false,
  // },
  {
    accessorKey: "name",
    header: "Working Group Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => <Actions row={row} />,
  },
];

export function Actions(props: any) {
  const row = props.row;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const {
    data: group,
    error,
    isLoading,
    refetch,
  } = useQuery("group", fetchWorkingGroup);

  const [formData, setFormData] = useState({
    name: row.original.name,
    description: row.original.description,
  });

  // Handle form field changes
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Here you can handle the form data, like sending it to an API
    console.log(formData);

    const res = await fetch(Backend_URL + "/working-group/add/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: row.original.id,
        name: formData.name,
        description: formData.description,
      }),
    });
    if (res.status == 401) {
      console.log(res.statusText);
    } else {
      const data = await res.json();
      console.log(data);
      refetch();
      setFormData({ name: data.name, description: data.description });
      toast({
        title: "Working Group Updated!",
        variant: "default",
        description: `Working Group Has Been Updated Successfully!`,
      });
    }
  };

  return (
    //  <CellAction data={row.original} />
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Icons.editicon className="h-4 w-4 cursor-pointer" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Group</DialogTitle>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setShowDeleteDialog(true);
          }}
        >
          <Icons.deleteicon className="h-4 w-4 cursor-pointer" />
        </Button>
      </div>
      {/* delete modal */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure want to delete Group?
            </AlertDialogTitle>
            {/* <AlertDialogDescription>
                  NOTE: All Users to this category will also be deleted.
                </AlertDialogDescription> */}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                fetch(Backend_URL + "/working-group/" + row.original.id, {
                  method: "DELETE",
                })
                  .then((res) => res.json())
                  .then((data) => {
                    refetch();
                  });
                // yes, you have to set a timeout
                setTimeout(() => (document.body.style.pointerEvents = ""), 100);

                setShowDeleteDialog(false);
                toast({
                  variant: "destructive",
                  description: "Working Group has been deleted.",
                });
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* edit modal */}
    </>
  );
}
