'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { Backend_URL } from "@/lib/Constants";
import { MinusCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";


export default function AssignToWorkGroup() {

    const fetchUsers = async () => {
        const response = await fetch(Backend_URL + "/user/all")
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }

    const fetchWorkingGroup = async () => {
        const response = await fetch(Backend_URL + `/working-group`)
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    }

    const fetchAssignUsers = async (id: any) => {
        setSelectedGroupId(id)
        if (id) {
            const response = await fetch(Backend_URL + `/assign-working-group/${id}`)
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        }
    }


    const [users, setUsers] = useState<any[]>([]);
    const [groups, setGroups] = useState<any[]>([]);
    const [selectedRows, setSelectedRows] = useState<any[]>([]);
    const [assignUsers, setAssignUsers] = useState<any[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number>();
    const [searchText, setSearchText] = useState("");


    const { data: allusers, error: userError, isLoading: userLoading, refetch: refetchUser } = useQuery("user", fetchUsers, { onSuccess: setUsers });

    const { data: group, error: roleError, isLoading: groupLoading, refetch: refetchGroup } = useQuery("group", fetchWorkingGroup,);

    const { data: assignUser, error: assignedUsersError, isLoading: assignedUsersLoading, refetch: assignRefetch } = useQuery(["assignedUsers", selectedGroupId], () => fetchAssignUsers(selectedGroupId))



    useEffect(() => {
        const Filter_users: any[] = []
        if (allusers && assignUser) {
            if (group && group.length > 0) {
                (allusers as any[]).forEach((user: any) => {
                    const isUserSelected = assignUser.find((assign_user: any) => assign_user.userId === user.id);
                    if (!isUserSelected) {
                        Filter_users.push(user);
                    }
                });
                setUsers(Filter_users);
            } else {
                setUsers(allusers);
            }
        }
        setGroups(group ?? []);
        setAssignUsers(assignUser ?? []);
    }, [allusers, group, assignUser]);



    let searchHandler = (e: any) => {
        var lowerCase = e.target.value.toLowerCase();
        setSearchText(lowerCase);
    };

    const filteredData = users.filter((alluser: any) => {
        if (searchText === '') {
            return alluser;
        }
        else {
            return alluser.name.toLowerCase().includes(searchText)
        }
    })




    const handleSelectedRows = (id: number) => {
        if (selectedRows.includes(id)) {
            const data = selectedRows.filter(row => row !== id)
            setSelectedRows(data)

        } else {
            setSelectedRows([...selectedRows, id])
        }
    }


    const handleSelectAllUsers = () => {
        if (selectedRows.length < users.length) {
            setSelectedRows(users.map(({ id }) => id));
        } else {
            setSelectedRows([]);
        }
    };



    const handleAssignUsers = () => {
        if (!selectedGroupId) {
            toast({
                title: `No Working Group Selected!`,
                variant: "default",
                description: `Select the working group!`,
            });
            return;
        }


        const hasBlockedRole = selectedRows.some(userId => {
            const user = users.find(user => user.id === userId);
            return user && user.details.Role === "Blocked";
        });

        const assignedUsers = users.filter(user => {
            const isSelected = selectedRows.includes(user.id);
            return isSelected && user.details.Role !== "Blocked";
        });
    
        if (hasBlockedRole && assignedUsers.length === 0) {
            toast({
                title: "Cannot Assign Users",
                variant: "default",
                description: "Please assign users with roles other than 'Blocked' in order to assign the working group",
            });
            return;
        }

        const data = assignedUsers.map((user: any) => ({
            "userId": user.id,
            "groupId": selectedGroupId

        }))

        assignUserToGroup(data);

        setSelectedRows([]);

        toast({
            title: `Users Assigned!`,
            variant: "default",
            description: `Users Assigned Successfully!`,
        });
    };



    async function assignUserToGroup(data: any) {
        try {
            const response = await fetch(Backend_URL + `/assign-working-group`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to assign user to group');
            }
            const res = await response.json();
            assignRefetch()
            refetchGroup()

        } catch (error) {
            console.error('Error assigning user to group');
        }

    }


    const handlefetchuser = async (id: any) => {
        setSelectedGroupId(parseInt(id));
    }


    const handleDeleteUser = async ({ id }: { id: number }) => {
        try {
            const response = await fetch(Backend_URL + `/assign-working-group/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to assign user to group');
            }
            const res = await response.json();
            assignRefetch();
            refetchGroup();

        } catch (error) {
            console.error('Error assigning user to group');
        }

        toast({
            variant: "destructive",
            description: "Assigned User has been deleted.",
        });

    };


    if (userLoading || groupLoading) {
        return <div>Loading...</div>;
    }


    return (
        <>
            <div className='grid m-4'>
                <div className='flex gap-3'>
                    <div className='w-5/12'>
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
                                <div className='m-2'>
                                    <div className='flex gap-3 mb-4'>
                                        <Checkbox
                                            checked={selectedRows.length === users.length}
                                            onCheckedChange={handleSelectAllUsers} />
                                        <p>Select All</p>
                                    </div>
                                    <div>
                                        <div className="max-h-[57vh] overflow-y-auto">
                                            {filteredData.map(user => (
                                                <div
                                                className={`p-2 flex gap-5 border-b-2`}
                                                key={user.id}
                                                style={{ backgroundColor: user.details.Role === "Blocked" ? 'rgba(255, 0, 0, 0.1)' : 'transparent', outline: user.details.Role === "Blocked" ? '2px solid red' : 'none' }}
                                                >
                                                    <Checkbox className="my-auto"
                                                        checked={selectedRows.includes(user.id)}
                                                        onCheckedChange={() => handleSelectedRows(user.id)}
                                                    />
                                                    <Avatar>
                                                        <AvatarFallback className='bg-orange-500 text-white capitalize'>{user.details["First Name"].charAt(0)}{user.details["Last Name"].charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className='text-base capitalize'>{user.name}</p>
                                                        <p className='text-xs'>{user.email}</p>
                                                    </div>
                                                    <div className="ms-auto">
                                                        <p className='text-base capitalize font-medium'>{user.details["Role"]}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button className='bg-primary text-primary-foreground w-full p-2' onClick={handleAssignUsers}>Assign Users</button>
                            </CardDescription>
                        </Card>
                    </div>

                    <div className='w-8/12'>
                        {groups.length > 0 && (
                            <>
                                <div className="flex gap-3 mb-3">
                                    <label className='font-medium text-base text-muted-foreground mt-2'>Working Group</label>
                                    <select
                                        value={selectedGroupId}
                                        onChange={(e: any) => handlefetchuser(e.target.value)}
                                        className='p-2 my-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary bg-zinc-600 text-white checked:bg-orange-600'
                                    >
                                        <option value="">Select Working Group</option>
                                        {groups.map(group => {
                                            return (
                                                <option value={group.id} key={group.id}>
                                                    {group.name} - {group._count.working_groups ? group._count.working_groups + " users added" : "No users added"}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>

                                {selectedGroupId ? (
                                    assignUsers.length > 0 ? (
                                        <Table>
                                            <TableHeader>
                                                <TableRow className='bg-gray-400 text-white hover:bg-gray-400'>
                                                    <TableCell>Name</TableCell>
                                                    <TableCell>Email ID</TableCell>
                                                    <TableCell>Country</TableCell>
                                                    <TableCell>Role</TableCell>
                                                    <TableCell>Action</TableCell>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {assignUsers.map(user => (
                                                    <TableRow key={user.id}>
                                                        <TableCell className='capitalize flex items-center gap-1'>
                                                            <Avatar>
                                                                <AvatarFallback className='bg-orange-500 text-white'>{user.user.details["First Name"].charAt(0)}{user.user.details["Last Name"].charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            {user.user.name}
                                                        </TableCell>
                                                        <TableCell>{user.user.email}</TableCell>
                                                        <TableCell className='capitalize'>{user.user.details["Country"]}</TableCell>
                                                        <TableCell className='capitalize'>{user.user.details["Role"]}</TableCell>
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
                                                                        Are you sure to unassign this user from the group?
                                                                    </DialogDescription>
                                                                    <DialogFooter className='p-2'>
                                                                        <button className='bg-primary text-primary-foreground px-3 py-1 rounded-md' onClick={() => handleDeleteUser({ id: user.id })}>Yes</button>
                                                                        <DialogClose><button className='bg-muted-foreground text-primary-foreground px-3 py-1 rounded-md'>No</button></DialogClose>
                                                                    </DialogFooter>
                                                                </DialogContent>
                                                            </Dialog>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    ) : (
                                        <div className="text-center mt-5">
                                            <p className="text-3xl font-semi-bold">No User Found</p>
                                            <p className="mt-3 text-xl">Please add users to the working group</p>
                                        </div>
                                    )
                                ) : (
                                    <div className="text-center mt-5">
                                        <p className="text-3xl font-semi-bold">Select Working Group</p>
                                        <p className="mt-3 text-xl">Please select a working group to view assigned users</p>
                                    </div>
                                )}



                            </>
                        )}

                        {groups.length === 0 &&
                            <div className="text-center">
                                <p className="text-2xl font-bold">No working groups available</p>
                                <p className="mt-3 text-xl">Add new working group</p>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </>
    );

}





