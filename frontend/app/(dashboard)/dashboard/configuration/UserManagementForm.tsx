"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery } from "react-query";
import { Backend_URL } from "@/lib/Constants";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import DynamicOptionsForm from "./dynamic-options";
import { ScrollArea } from "@/components/ui/scroll-area";

export async function fetchCustomFeilds() {
  const response = await fetch(Backend_URL + "/customfeilds?category=user");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export default function UserManagementForm() {
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState("");
  const [inputType, setInputType] = React.useState("");

  const {
    data: customfeilds,
    error,
    isLoading,
    refetch,
  } = useQuery("customfeilds", fetchCustomFeilds);

  const [edidFields, setEditFields] = useState({
    id: 0,
    name: "",
    type: "",
    placeholder: "",
    label: "",
  });

  // var for dynamic option single select
  const [options, setOptions] = useState(["Option 1", "Option 2"]);
  const [selectedOption, setSelectedOption] = useState("");
  const [newOption, setNewOption] = useState("");
  const [editingOption, setEditingOption] = useState(null); // State to track the currently editing option
  const [editValue, setEditValue] = useState(""); // State to hold the edit input value

  const handleAddOption = (e: any) => {
    e.preventDefault();
    if (newOption && !options.includes(newOption)) {
      setOptions([...options, newOption]);
      setNewOption("");
    }
  };

  const handleDeleteOption = (optionToDelete: any) => {
    setOptions(options.filter((option) => option !== optionToDelete));
    if (selectedOption === optionToDelete) {
      setSelectedOption("");
    }
  };

  const handleEditOption = (option: any) => {
    setEditingOption(option);
    setEditValue(option);
  };

  const handleEditChange = (e: any) => {
    e.preventDefault();
    setEditValue(e.target.value);
  };

  const handleSubmitEdit = (originalOption: any) => {
    const updatedOptions = options.map((option) =>
      option === originalOption ? editValue : option
    );
    setOptions(updatedOptions);
    setEditingOption(null);
    setEditValue("");
    if (selectedOption === originalOption) {
      setSelectedOption(editValue);
    }
  };
  // var for dynamic option single select

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    // Here you can handle the form data, like sending it to an API
    const formData = {
      name: e.target.label.value,
      type: e.target.type.value,
      placeholder: e.target.placeholder.value,
      label: e.target.label.value,
      options: options,
      category:"user",
    };
    console.log(formData);
    const res = await fetch(Backend_URL + "/customfeilds/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    if (res.status == 401) {
      console.log(res.statusText);
    } else {
      const data = await res.json();
      console.log(data);
      refetch();
      toast({
        title: "Custom Field Created!",
        variant: "default",
        description: `Custom Field Created Successfully!`,
      });
      setShowAddDialog(false);
    }
  };

  // edit

  const handleEdit = async (e: any, id: any) => {
    e.preventDefault();
    // Here you can handle the form data, like sending it to an API
    // console.log(e.target.label.value);

    const res = await fetch(Backend_URL + "/customfeilds/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        name: e.target.label.value,
        type: e.target.type.value,
        placeholder: e.target.placeholder.value,
        label: e.target.label.value,
        options: options,
      }),
    });
    if (res.status == 401) {
      console.log(res.statusText);
    } else {
      const data = await res.json();
      // console.log(data);
      refetch();
      toast({
        title: "Custom Field Updated!",
        variant: "default",
        description: `Custom Field Has Been Updated Successfully!`,
      });

      setShowEditDialog(false);
    }
  };

  const del = (id: any) => {
    fetch(Backend_URL + "/customfeilds/" + id, {
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
  };

  const handleActivate = async (value: any, id: any) => {
    const res = await fetch(Backend_URL + "/customfeilds/activate", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        active: value,
      }),
    });
    if (res.status == 401) {
      console.log(res.statusText);
    } else {
      const data = await res.json();
      // console.log(data);
      refetch();
      toast({
        title: `Custom Field ${value ? "Activated" : "Deactivated"}!`,
        variant: "default",
        // description: `Custom Field Has Been ${value?"Activated":"Deactivated"}!`,
      });

      setShowEditDialog(false);
    }
  };

  const handleRequired = async (value: any, id: any) => {
    const res = await fetch(Backend_URL + "/customfeilds/required", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        requiredfield: value,
      }),
    });
    if (res.status == 401) {
      console.log(res.statusText);
    } else {
      const data = await res.json();
      // console.log(data);
      refetch();
      toast({
        title: `Custom Field ${value ? "Mandatory	" : "Optional"}!`,
        variant: "default",
        // description: `Custom Field Has Been ${value?"Activated":"Deactivated"}!`,
      });

      setShowEditDialog(false);
    }
  };

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error;

  return (
    <div>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-end-8 col-span-1 ">
          <Dialog open={showAddDialog}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setOptions(["Option 1", "Option 2"]);
                  setShowAddDialog(true);
                }}
                variant="outline"
              >
                Add Field
              </Button>
            </DialogTrigger>
            <DialogContent  className="sm:max-w-[495px]">
              <DialogHeader>
                <DialogTitle>Add New Custom feild</DialogTitle>
                {/* <DialogDescription>
                  What do you want to get done today?
                </DialogDescription> */}
              </DialogHeader>
              <div className="max-w-lg p-4 rounded-lg">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Display Name <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="label"
                      name="label"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Placeholder
                      <span style={{ color: "red" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="placeholder"
                      name="placeholder"
                      required
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type <span style={{ color: "red" }}>*</span>
                    </label>
                    <select
                      id="type"
                      name="type"
                      onChange={(e: any) => setInputType(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a Type</option>
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Single Select</option>
                      {/* <option value="multi-select">Multi Select</option> */}
                      <option value="date">Date</option>
                    </select>
                  </div>

                  {inputType == "select" && (
                    <>
                      <div
                        className="mb-4"
                        style={{ maxHeight: "170px", overflowY: "auto" }}
                      >
                        <ul>
                          {options.map((option, index) => (
                            <li
                              key={index}
                              className="flex justify-between items-center bg-gray-100 rounded px-4 py-2 my-2"
                            >
                              {editingOption === option ? (
                                <form className="flex flex-grow">
                                  <input
                                    type="text"
                                    value={editValue}
                                    onChange={handleEditChange}
                                    className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                  />
                                  <button
                                    onClick={() => handleSubmitEdit(option)}
                                    className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                  >
                                    Save
                                  </button>
                                </form>
                              ) : (
                                <>
                                  {option}
                                  <div>
                                    <button
                                      type="button"
                                      onClick={() => handleEditOption(option)}
                                      className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteOption(option)}
                                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mb-0">
                        <input
                          type="text"
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          placeholder="Add new option"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                        <button
                          onClick={handleAddOption}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 w-full"
                        >
                          Add Option
                        </button>
                      </div>
                    </>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setShowAddDialog(false)}
                      className="bg-gray-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className=" bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Submit
                    </button>
                  </div>
                </form>
                <ScrollArea />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <br />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">System Name</TableHead>
            <TableHead>Display Name</TableHead>
            <TableHead>Field Type</TableHead>
            <TableHead className="text-right">Edit</TableHead>
            <TableHead className="text-right">Active</TableHead>
            <TableHead className="text-right">Mandatory</TableHead>
          
            
          </TableRow>
        </TableHeader>
        <TableBody>
          {customfeilds.map((feilds: any, index: any) => {
            return (
              <TableRow key={feilds.id}>
                <TableCell className="font-medium">
                  {feilds.systemName || feilds.label}
                </TableCell>
                <TableCell>{feilds.label}</TableCell>
                <TableCell>{feilds.type}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowDeleteDialog(true);
                      setSelectedId(feilds.id);
                    }}
                    disabled={feilds.primary}
                  >
                    <Icons.deleteicon className="h-4 w-4 cursor-pointer" />
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => {
                      setOptions(feilds.options);
                      setEditFields({
                        id: feilds.id,
                        name: feilds.name,
                        type: feilds.type,
                        placeholder: feilds.placeholder,
                        label: feilds.label,
                      });
                      setShowEditDialog(true);
                    }}
                    size="icon"
                    disabled={feilds.primary}
                  >
                    <Icons.editicon className="h-4 w-4 cursor-pointer" />
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Checkbox
                    checked={feilds.primary ? feilds.primary : feilds.active}
                    disabled={feilds.primary}
                    onCheckedChange={(value) => {
                      if(feilds.requiredfield==false){
                      handleActivate(value, feilds.id);
                      }
                    }}
                    aria-label="Select row"
                  />
                  &nbsp;&nbsp;
                </TableCell>
                <TableCell className="text-right">
                  <Checkbox
                    checked={feilds.primary ? feilds.primary : feilds.requiredfield}
                    disabled={feilds.primary}
                    onCheckedChange={(value) => {
                      if(feilds.active==true){
                      handleRequired(value, feilds.id);
                      }
                    }}
                    aria-label="Select row"
                  />
                  &nbsp;&nbsp;
                </TableCell>
            
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <Dialog open={showEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Custom Fields</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e: any) => {
              handleEdit(e, edidFields.id);
            }}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="elabel"
                className="block text-sm font-medium text-gray-700"
              >
                Display Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="elabel"
                name="label"
                required
                defaultValue={edidFields.label}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="eplaceholder"
                className="block text-sm font-medium text-gray-700"
              >
                Placeholder
                <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="eplaceholder"
                name="placeholder"
                required
                defaultValue={edidFields.placeholder}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="etype"
                className="block text-sm font-medium text-gray-700"
              >
                Type <span style={{ color: "red" }}>*</span>
              </label>
              <select
                id="etype"
                name="type"
                defaultValue={edidFields.type}
                onChange={(e: any) =>
                  setEditFields({ ...edidFields, type: e.target.value })
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select a Type</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="select">Single Select</option>
                {/* <option value="multi-select">Multi Select</option> */}
                <option value="date">Date</option>
              </select>
            </div>

            {edidFields.type == "select" && (
              <>
                <div
                  className="mb-4"
                  style={{ maxHeight: "170px", overflowY: "auto" }}
                >
                  <ul>
                    {options.map((option, index) => (
                      <li
                        key={index}
                        className="flex justify-between items-center bg-gray-100 rounded px-4 py-2 my-2"
                      >
                        {editingOption === option ? (
                          <form className="flex flex-grow">
                            <input
                              type="text"
                              value={editValue}
                              onChange={handleEditChange}
                              className="flex-grow shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <button
                              onClick={() => handleSubmitEdit(option)}
                              className="ml-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                            >
                              Save
                            </button>
                          </form>
                        ) : (
                          <>
                            {option}
                            <div>
                              <button
                                type="button"
                                onClick={() => handleEditOption(option)}
                                className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline mr-2"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteOption(option)}
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                              >
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-0">
                  <input
                    type="text"
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder="Add new option"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                  <button
                    onClick={handleAddOption}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-3 w-full"
                  >
                    Add Option
                  </button>
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <a
                onClick={() => setShowEditDialog(false)}
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure want to Field?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                del(selectedId);
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
