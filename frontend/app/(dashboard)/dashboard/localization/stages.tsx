"use client";
import React, { FormEvent, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import { EditIcon } from "lucide-react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Backend_URL } from "@/lib/Constants";

interface Stage {
  systemName: string;
  displayName: string;
  default?: boolean;
}

type DialogState = {
  open: boolean;
  roleId: string | null;
};

export default function Stages() {
  const [data, setData] = useState<Stage[]>([]);
  const [saveData, setSaveData] = useState<Stage[]>([]);
  const [showAddDialog, setShowAddDialog] = useState<boolean>(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState<DialogState>({
    open: false,
    roleId: null,
  });
  const [showEditDialog, setShowEditDialog] = useState<DialogState>({
    open: false,
    roleId: null,
  });
  const [showResetDialog, setShowResetDialog] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<Stage[]>(Backend_URL+"/stages");
      setData(response.data);
      setSaveData([...response.data]);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleChange = (index: number, newValue: string) => {
    setData((prevData) =>
      prevData.map((item, idx) =>
        idx === index ? { ...item, displayName: newValue } : item
      )
    );
  };

  const handleCreateRole = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const role = formData.get("role");

    const newRole = {
      role: formData.get("role"),
    };

    if (typeof role === "string" && role.trim() !== "") {
      try {
        await axios.post(Backend_URL+"/stages", newRole);
        setShowAddDialog(false);
        await fetchData();
        toast({
          title: "Stage added successfully",
          description: "A new stage was added.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an issue adding the stage.",
        });
      }
    }
  };

  const handleEditRole = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const roleId = formData.get("disabledRole");
    const displayName = formData.get("displayName");

    if (
      typeof roleId === "string" &&
      typeof displayName === "string" &&
      roleId.trim() !== "" &&
      displayName.trim() !== ""
    ) {
      try {
        await axios.put(Backend_URL+`/stages/${roleId}`, {
          displayName,
        });
        setShowEditDialog({ open: false, roleId: null });
        await fetchData();
        toast({
          title: "Stage edited successfully",
          description: "The stage has been updated.",
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was an issue editing the stage.",
        });
      }
    }
  };

  const handleDeleteRole = async (roleId: string | null) => {
    if (!roleId) return;

    try {
      await axios.delete(Backend_URL+`/stages/${roleId}`);
      setShowDeleteDialog({ open: false, roleId: null });
      await fetchData();
      toast({
        title: "Stage deleted",
        description: "The stage has been removed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue deleting the stage.",
      });
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(Backend_URL+"/stages/reset");
      setShowResetDialog(false);
      await fetchData();
      toast({
        title: "Stages reset",
        description: "All stages have been reset to their defaults.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue resetting the stages.",
      });
    }
  };

  const handleSave = async () => {
    try {
      const stagesToUpdate = data.filter(
        (stage, index) => stage.displayName !== saveData[index].displayName
      );
      await axios.post(Backend_URL+"/stages/save", stagesToUpdate);
      fetchData();
      toast({
        title: "Stages saved successfully",
        description: "The stages were saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an issue saving the stages.",
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <>
      <div className="flex">
        <Card className="pt-2 flex-1 mr-1 min-w-[250px]">
          <div className="flex item-center">
            <div className="flex-1">
              <h3 className="mb-2 ml-2.5 block text-lg font-medium text-gray-700">
                System name
              </h3>
            </div>
            <PlusCircle
              className="h-6 w-6 cursor-pointer text-gray-700 mr-2"
              onClick={() => setShowAddDialog(true)}
            />
          </div>

          <div>
            <ul>
              {data.map((item, index) => (
                <div key={index} className=" border-t border-gray-300">
                  <li className="p-2.5 whitespace-nowrap overflow-hidden text-ellipsis">
                    {item.systemName}
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="pt-2 flex-1 ml-1 min-w-[250px]">
          <div className="flex item-center">
            <div className="flex-1">
              <h3 className="mb-2 ml-2.5 block text-lg font-medium text-gray-700">
                Display name
              </h3>
            </div>
            <RotateCcw
              className="h-6 w-6 cursor-pointer text-gray-700 mr-2"
              onClick={() => setShowResetDialog(true)}
            />
          </div>
          <div>
            <ul>
              {data.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center border-t border-gray-300"
                >
                  <input
                    type="text"
                    className="p-2.5 flex-1 whitespace-nowrap overflow-ellipsis"
                    value={item.displayName}
                    id={item.systemName}
                    onChange={(e) => handleChange(index, e.target.value)}
                    spellCheck={false}
                    style={{
                      appearance: "none",
                      outline: "none",
                    }}
                    minLength={1}
                    onKeyDown={(e) => {
                      if (
                        (e.key === "Backspace" &&
                          item.displayName.length === 1) ||
                        (e.ctrlKey &&
                          e.key === "x" &&
                          item.displayName.length === 1)
                      ) {
                        e.preventDefault();
                      }
                    }}
                  ></input>
                  <Trash2
                    className={`h-4 w-4 cursor-pointer text-gray-700 mr-2 ${
                      item.default ? "opacity-50 pointer-events-none" : ""
                    }`}
                    onClick={() =>
                      !item.default &&
                      setShowDeleteDialog({
                        open: true,
                        roleId: item.systemName,
                      })
                    }
                  />
                  <EditIcon
                    className="h-4 w-4 cursor-pointer text-gray-700 mr-2"
                    onClick={() =>
                      setShowEditDialog({
                        open: true,
                        roleId: item.systemName,
                      })
                    }
                  />
                </div>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      <div className="flex justify-end mt-2">
        <Button
          className="bg-primary hover:bg-primary text-white font-bold rounded focus:outline-none focus:shadow-outline w-24"
          disabled={JSON.stringify(data) === JSON.stringify(saveData)}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>

      <Dialog open={showAddDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add new role</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateRole} className="space-y-3">
            <div>
              <label
                htmlFor="addrole"
                className="block text-sm font-medium text-gray-700"
              >
                Stage System Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="addrole"
                name="role"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center justify-between">
              <a
                onClick={() => setShowAddDialog(false)}
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

      <Dialog open={showEditDialog.open}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle> Edit Stage</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditRole} className="space-y-3">
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Stage System Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={showEditDialog.roleId || ""}
                spellCheck="false"
                disabled
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="block text-sm font-medium text-gray-700"
              >
                Stage Display Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <input
              type="hidden"
              name="disabledRole"
              value={showEditDialog.roleId || ""}
            />

            <div className="flex items-center justify-between">
              <a
                onClick={() => setShowEditDialog({ open: false, roleId: null })}
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

      <AlertDialog open={showDeleteDialog.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure want to delete this stage?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowDeleteDialog({ open: false, roleId: null })}
            >
              Cancel
            </AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => handleDeleteRole(showDeleteDialog.roleId)}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              This will reset all the default stages and remove the created ones
              ?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                handleReset();
              }}
            >
              Confirm
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
