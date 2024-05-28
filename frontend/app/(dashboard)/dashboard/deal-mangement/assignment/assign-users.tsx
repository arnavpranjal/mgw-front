"use client";
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Backend_URL } from '@/lib/Constants';
import { MinusCircle, Pencil, X, Search } from 'lucide-react';
import { useQuery } from 'react-query';


import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableCell,
} from "@/components/ui/table";
import {
    Card,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import {
    Dialog,
    DialogTrigger,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { toast } from '@/components/ui/use-toast';

const fetchUsers = async () => {
    const response = await fetch(Backend_URL + "/user/all")
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

const fetchRoles = async () => {
    const response = await fetch(Backend_URL + "/roles")
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();

}

const fetchAssignedUsers = async (id: any) => {
    const response = await fetch(Backend_URL + `/assignedUsers/${id}`)
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

type DealProps = {

    dealId: number;
}

const AssignUsers: React.FC<DealProps> = ({ dealId }) => {
    const [allUsers, setAllUsers] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [assignedUsers, setAssignedUsers] = useState<any[]>([]);
    const [isShown, setIsShown] = useState<{ [key: number]: boolean }>({});
    const [searchText, setSearchText] = useState("");

    const [selectedRoleId, setSelectedRoleId] = useState<any>();




    const {
        data: users,
        error: userError,
        isLoading: userLoading,
    } = useQuery("users", fetchUsers);


    const {
        data: roles,
        error: roleError,
        isLoading: roleLoading,
    } = useQuery("roles", fetchRoles);

    const {
        data: assignUsers,
        error: assignedUsersError,
        isLoading: assignedUsersLoading,
        refetch: assignRefetch
    } = useQuery(["assignedUsers", dealId], () => fetchAssignedUsers(dealId))



    useEffect(() => {
        const Filter_users: any[] = []
        if (users && assignUsers) {
            users.forEach((user: any) => {
                const is_user_selected = assignUsers.find((assign_user: any) => assign_user.userId == user.id)
                if (!is_user_selected) {
                    Filter_users.push(user)
                }
            });
        }
        const fetchRolesAndSetDefault = async () => {
            try {
                const rolesData = await fetchRoles();

                const defaultRole = rolesData.find((role: any) => role.displayName === "Blocked");

                const defaultRoleId = defaultRole ? defaultRole.id : "";

                setSelectedRoleId(defaultRoleId);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchRolesAndSetDefault();

        setAllUsers(Filter_users);
        setAssignedUsers(assignUsers ?? []);


    }, [users, assignUsers]);




    const handleMouseEnter = (userId: number) => {
        setIsShown(prevState => ({
            prevState,
            [userId]: true
        }));
    };

    const handleMouseLeave = (userId: number) => {
        setIsShown(prevState => ({
            prevState,
            [userId]: false
        }));
    };



    const handleSelectedRows = (id: number) => {

        if (selectedRows.includes(id)) {
            const data = selectedRows.filter(row => row !== id)

            setSelectedRows(data)

        } else {
            setSelectedRows([...selectedRows, id])
        }
    }

    const handleSelectAllUsers = () => {
        if (selectedRows.length < allUsers.length) {
            setSelectedRows(allUsers.map(({ id }: { id: any }) => id));
        } else {
            setSelectedRows([]);
        }
    };

    const handleDropdownChange = (e: any) => {
        setSelectedRoleId(parseInt(e.target.value));
    };


    const handleAssignUsers = async (e: any) => {
        e.preventDefault();
        const data = allUsers.filter((user: any) => selectedRows.includes(user.id));



        const formData = data.map((user: any) => ({
            "userId": user.id,
            "dealId": dealId,
            "roleId": selectedRoleId,

        }))


        const res = await fetch(Backend_URL + `/assignedUsers`, {
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


            assignRefetch();
            toast({
                title: "User Assigned!",
                variant: "default",
                description: `User Assigned to the Deal Successfully`,
            });

        }
        setSelectedRoleId("");
        setSelectedRows([]);


    }

    const handleRoleChange = async (id: number, e: any) => {
        const usersRole = assignedUsers.find((user: any) => user.id === id)


        const newRole = { ...usersRole, roleId: parseInt(e.target.value) }

        const res = await fetch(Backend_URL + `/assignedUsers/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newRole),
        });
        if (res.status == 401) {
            console.log(res.statusText);
        } else {
            const data = await res.json();

            assignRefetch();
            toast({
                title: "Role Updated!",
                variant: "default",
                description: `Role has been Updated Successfully!`,
            });


        }
    }

    const handleDelete = async ({ id }: { id: any }) => {

        fetch(Backend_URL + `/assignedUsers/${id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then((data) => {
                assignRefetch();
            });

        setTimeout(() => (document.body.style.pointerEvents = ""), 100);
        toast({
            variant: "destructive",
            description: "Assigned User has been deleted.",
        });


    };


    let searchHandler = (e: any) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchText(lowerCase);
    };



    const filteredData = allUsers.filter((alluser: any) => {

        if (searchText === '') {
            return alluser;

        }
        else {
            return alluser.name.toLowerCase().includes(searchText)
        }
    })



    if (userLoading || roleLoading || assignedUsersLoading) return "Loading...";


    if (userError) return "An error has occurred: " + userError;

    if (roleError) return "An error has occurred: " + roleError;

    if (assignedUsersError) return "An error has occurred: " + assignedUsersError;






    return (
        <div className='grid m-3'>
            <div className='flex gap-3'>
                <div className='w-4/12'>
                    <Card className='rounded-md p-2 mb-3'>
                        <div className='flex gap-3'>
                            <CardTitle className='font-medium text-base text-muted-foreground'>
                                Available Users
                            </CardTitle>
                            <div className="relative">
                                <input

                                    onChange={searchHandler}
                                    className="w-full py-1 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                    type="search" placeholder="Search User" />
                                <div className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                    <svg width="20" height="20" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
                                        </path>
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <CardDescription>
                            <div className='flex my-2'>
                                <label className='items-center my-auto me-1'>Assign Role :</label>
                                <select
                                    className='p-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary'

                                    onChange={handleDropdownChange}
                                    value={selectedRoleId}
                                >
                                    {

                                        roles.map((role: any) => (
                                            <option key={role.id} className='bg-zinc-700 text-white' value={role.id}>{role.displayName}</option>
                                        ))
                                    }

                                </select>
                            </div>
                            <div className='m-2'>
                                <div className='flex gap-3 mb-4'>
                                    <Checkbox className='my-auto'
                                        checked={selectedRows.length === allUsers.length}
                                        onCheckedChange={handleSelectAllUsers}
                                    />


                                    <p>Select All</p>

                                </div>



                                <div className='max-h-[57vh] overflow-y-auto'>
                                    {
                                        filteredData.map((user: any) => (

                                            <div
                                                className='p-3 flex gap-5 border-b-2'

                                                key={user.id}
                                            >
                                                <Checkbox className='my-auto'
                                                    checked={selectedRows.includes(user.id)}
                                                    onCheckedChange={() => handleSelectedRows(user.id)}
                                                />
                                                <Avatar>
                                                    <AvatarFallback
                                                        className='bg-orange-500 text-white capitalize'
                                                    >
                                                        {user.details["First Name"].charAt(0)}{user.details["Last Name"].charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className='text-base capitalize'>{user.name}</p>
                                                    <p className='text-xs'>{user.email}</p>
                                                </div>

                                            </div>

                                        ))
                                    }
                                </div>

                            </div>
                            <button className='bg-primary text-primary-foreground w-full p-2'
                                onClick={handleAssignUsers}
                            >Assign Users</button>
                        </CardDescription>
                    </Card>
                </div>
                <div className='w-8/12'>

                    <Table className=''>
                        <TableHeader>
                            <TableRow className='bg-gray-400 text-white hover:bg-gray-400'>
                                <TableCell>Name</TableCell>
                                <TableCell>Email ID</TableCell>
                                <TableCell>Country</TableCell>
                                <TableCell>Deal</TableCell>
                                <TableCell>Role</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHeader>

                        <TableBody>

                            {assignedUsers.map((user: any) => (
                                <TableRow key={user.id}>
                                    <TableCell className='capitalize flex items-center gap-1'>
                                        <Avatar>
                                            <AvatarFallback className='bg-orange-500 text-white'>{user.user.details["First Name"]?.charAt(0)}{user.user.details["Last Name"]?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        {user.user.name}</TableCell>
                                    <TableCell>{user.user.email}</TableCell>
                                    <TableCell className='capitalize'>

                                        {user.user.details["Country"]}
                                    </TableCell>
                                    <TableCell className='capitalize'>{user.deal.name}</TableCell>
                                    <TableCell
                                        onMouseEnter={() => handleMouseEnter(user.id)}
                                        onMouseLeave={() => handleMouseLeave(user.id)}
                                        className='capitalize flex'>
                                        {
                                            !isShown[user.id] ?
                                                (
                                                    <div className='flex'>
                                                        <p>{user.role.displayName}</p>
                                                        <Pencil className='m-1' size={13} />
                                                    </div>

                                                ) :
                                                <select

                                                    className='cursor-pointer py-1 border-0 outline-none ring-1 ring-primary'
                                                    name="role" id="role"
                                                    value={user.roleId}
                                                    onChange={(e) => handleRoleChange(user.id, e)}
                                                >
                                                    {
                                                        roles.map((role: any) => (
                                                            <option key={role.id} className='bg-zinc-700 text-white' value={role.id}>{role.displayName}</option>
                                                        ))
                                                    }


                                                </select>
                                        }


                                    </TableCell>
                                    <TableCell>
                                        <Dialog>
                                            <DialogTrigger>
                                                <button><MinusCircle className='fill-red-500 text-white' /></button>
                                            </DialogTrigger>
                                            <DialogContent className='grid p-0'>
                                                <div className='flex justify-end bg-primary text-primary-foreground p-2'>

                                                    <DialogClose><X /></DialogClose>
                                                </div>

                                                <DialogDescription className='p-2'>
                                                    Are you sure to delete this user from the current Deal?
                                                </DialogDescription>
                                                <DialogFooter className='p-2'>
                                                    <DialogClose>
                                                        <button className='bg-primary text-primary-foreground px-3 py-1 rounded-md'
                                                            onClick={() => handleDelete({ id: user.id })}
                                                        >Yes</button>
                                                    </DialogClose>
                                                    <DialogClose><button className='bg-muted-foreground text-primary-foreground px-3 py-1 rounded-md'>No</button></DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>
                </div>
            </div>
        </div>
    )
}

export default AssignUsers