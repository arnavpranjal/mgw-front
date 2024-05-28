"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/constants/data";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Icons } from "../../icons";
import { Button } from "@/components/ui/button";
import useLocalization from "@/app/(dashboard)/dashboard/localization/localizationhook";

interface ExtraProps {
  handleEditUser: (props: any) => void;
  handleDeletetUser: (props: any) => void;
}

export const generateColumns = ({
  handleEditUser,
  handleDeletetUser,
}: ExtraProps): ColumnDef<User, any>[] => {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        return (
          <>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Avatar
                style={{ display: "inline", width: "25px", height: "25px" }}
              >
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  // className="w-5 h-5"
                  alt=""
                />
              </Avatar>
              &nbsp;&nbsp;
              <span>{row.original.name}</span>
            </div>
          </>
        );
      },
    },
    {
      accessorKey: "Email",
      header: "Email",
    },
    {
      accessorKey: "Role",
      header: "Role",

      // filterFn: (row, id, value) => {
      //   return value.includes(row.getValue(id));
      // },
    },
    {
      accessorKey: "Country",
      header: "Country",
    },
    {
      accessorKey: "lastLogin",
      header: "Last Login",
      cell: ({ row }) => {
        const now = new Date();
        const date = now.toLocaleDateString(); // e.g., "3/13/2024" in the US
        const time = now.toLocaleTimeString(); // e.g., "11:59 PM"

        return (
          <p>
            {date} {time}
          </p>
        );
      },
    },
    {
      header: "Action",
      id: "actions",
      cell: ({ row }) => {
        return (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditUser(row.original)}
            >
              <Icons.editicon className="h-4 w-4 cursor-pointer" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                handleDeletetUser(row.original.id);
              }}
            >
              <Icons.deleteicon className="h-4 w-4 cursor-pointer" />
            </Button>
          </>
        );
      },
    },
  ];
};

// export function Actions(props: any) {
//   const { refetch } = useQuery("users", fetchUsersData);
//   const row = props.row;
//   const [showDeleteDialog, setShowDeleteDialog] = useState(false);

//   // Handle form field changes
//   async function onData(data: any) {
//     console.log(data);

//     const res = await fetch(
//       Backend_URL + `/user/update?id=${row.original.id}`,
//       {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           name:
//             data["First Name"].toString() + " " + data["Last Name"].toString(),
//           email: data["Email"].toString(),
//           details: JSON.stringify(data),
//         }),
//       }
//     );
//     if (res.status == 401) {
//       console.log(res.statusText);
//     } else {
//       const data = await res.json();

//       sendRest(
//         data.email.toString(),
//         data.name.toString(),
//         "password",
//         process.env.DOMAIN ? process.env.DOMAIN : ""
//       );
//       console.log(data);
//       refetch();
//       setFormOpen(false);
//       toast({
//         title: "User Updated!",
//         variant: "default",
//         description: `User Has Been Updated Successfully!`,
//       });
//     }
//   }

//   const [formOpen, setFormOpen] = useState(false);

//   return (
//     <>
//       <div style={{ display: "flex", alignItems: "center" }}>
//         <Dialog open={formOpen}>
//           <DialogTrigger asChild></DialogTrigger>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Edit User</DialogTitle>
//             </DialogHeader>
//             <DynamicForm
//               onData={onData}
//               setFormOpen={setFormOpen}
//               usersData={row.original}
//               userId={row.original.id}
//             />
//           </DialogContent>
//         </Dialog>
//       </div>
//       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>
//               Are you sure want to delete User?
//             </AlertDialogTitle>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <Button
//               variant="destructive"
//               onClick={() => {
//                 fetch(Backend_URL + "/user/" + row.original.id, {
//                   method: "DELETE",
//                 })
//                   .then((res) => res.json())
//                   .then((data) => {
//                     refetch();
//                   });
//                 // yes, you have to set a timeout
//                 setTimeout(() => (document.body.style.pointerEvents = ""), 100);

//                 setShowDeleteDialog(false);
//                 toast({
//                   variant: "destructive",
//                   description: "User has been deleted.",
//                 });
//               }}
//             >
//               Delete
//             </Button>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// }
