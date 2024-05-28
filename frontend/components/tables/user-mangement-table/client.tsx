"use client";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { User } from "@/constants/data";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { generateColumns } from "./columns";
import { Icons } from "../../icons";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import DynamicForm from "@/components/forms/dynamic-form";
import EditDynamicForm from "@/components/forms/dynamic-form-edit";
import { Backend_URL } from "@/lib/Constants";
import { useQuery } from "react-query";
import { sendEmail, sendRest } from "@/lib/email";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import axios from "axios";

interface ProductsClientProps {
  data: User[];
}

export async function fetchUsersData() {
  const response = await fetch(Backend_URL + "/user/all");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}



export const UserClient: React.FC<ProductsClientProps> = () => {
  const router = useRouter();

  const { data: session } = useSession();

  const [formOpen, setFormOpen] = useState(false);

  const {
    data: users,
    error,
    isLoading,
    refetch,
  } = useQuery("users", fetchUsersData);


  // Handle form submission
  const handleSubmit = (data: any) => {
    const password = Math.random().toString(36).slice(2);

    fetch(Backend_URL + "/user/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name:
          data["First Name"].toString() + " " + data["Last Name"].toString(),
        email: data.Email.toString(),
        password: password,
        details: JSON.stringify(data),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        sendEmail(
          data.email.toString(),
          data.name.toString(),
          password,
          "https://mergerware-zeta.vercel.app"
        );
        console.log(data);
        setFormOpen(false);
        refetch();
      });
    // console.log(data);
  };

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Handle form field changes
  async function onData(data: any) {
    console.log(data);

    const res = await fetch(
      Backend_URL + `/user/update?id=${userFormData.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:
            data["First Name"].toString() + " " + data["Last Name"].toString(),
          email: data["Email"].toString(),
          details: JSON.stringify(data),
        }),
      }
    );
    if (res.status == 401) {
      console.log(res.statusText);
    } else {
      const data = await res.json();

      sendRest(
        data.email.toString(),
        data.name.toString(),
        "password",
        "https://mergerware-zeta.vercel.app"
      );
      console.log(data);
      refetch();
      setEditFormOpen(false);
      toast({
        title: "User Updated!",
        variant: "default",
        description: `User Has Been Updated Successfully!`,
      });
    }
  }

  const [editFormOpen, setEditFormOpen] = useState(false);
  const [userId, setUserId] = useState(0);
  const [userFormData, setUserData] = useState({ id: 0 });

  const handleEditUser = (userdata: any) => {
    console.log(userdata);
    setEditFormOpen(true);
    setUserData(userdata);
  };

  const handleDeletetUser = (id: any) => {
    console.log(id);
    setShowDeleteDialog(true);
    setUserId(id);
  };

  const columns = generateColumns({ handleEditUser, handleDeletetUser });

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error;

  const usersData = users.map((users: any) => {
    return { ...users.details, name: users.name, id: users.id };
  });

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        <div className="col-end-8 col-span-1 ">
          <Button variant="outline" size="icon">
            <Icons.DownloadCloudIcon className="h-4 w-4" />
          </Button>
          &nbsp;
          <Button variant="outline" size="icon">
            <Icons.UploadCloudIcon className="h-4 w-4" />
          </Button>
          &nbsp;
          <Dialog open={formOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFormOpen(true)}
              >
                <Icons.adduser className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                {/* <DialogDescription>
                  What do you want to get done today?
                </DialogDescription> */}
              </DialogHeader>
              {/* <div className="max-w-lg py-3 rounded-lg"> */}

              <DynamicForm onData={handleSubmit} setFormOpen={setFormOpen} />
              {/* </div> */}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Dialog open={editFormOpen}>
          <DialogTrigger asChild></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <EditDynamicForm
              onData={onData}
              setFormOpen={setEditFormOpen}
              usersData={userFormData}
              userId={userId}
            />
          </DialogContent>
        </Dialog>
      </div>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure want to delete User?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                if (session?.user.id != userId) {
                  fetch(Backend_URL + "/user/" + userId, {
                    method: "DELETE",
                  })
                    .then((res) => res.json())
                    .then((data) => {
                      refetch();
                    });
                  // yes, you have to set a timeout
                  setTimeout(
                    () => (document.body.style.pointerEvents = ""),
                    100
                  );

                  setShowDeleteDialog(false);
                  toast({
                    variant: "destructive",
                    description: "User has been deleted.",
                  });
                } else {
                  toast({
                    variant: "destructive",
                    description:
                      "You Cannot Delete Your Own Account From Here.",
                  });
                }
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DataTable searchKey="name" columns={columns} data={usersData} />
    </>
  );
};
