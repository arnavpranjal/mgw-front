"use client";
import React, { useState } from "react";
import AssignToGroup from "./asign-to-group";
import AssignUsers from "./assign-users";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { ChevronDown, X } from "lucide-react";
import { Icons } from "@/components/icons";

interface PageProps {
  params: { dealId: number };
  // searchParams: { [key: string]: string | string[] | undefined };
}
export default function Assignment({ params }: PageProps) {
  // function Assignment({ dealId }: { dealId: number }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button
          className="text-sm py-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold  rounded-md flex items-center justify-center w-32"
          style={{ minWidth: "150px" }}
        >
          <Icons.user width={15} /> &nbsp; Assignment
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="rounded-none">
        <Dialog>
          <p className="hover:bg-primary hover:text-primary-foreground p-2 text-center">
            <DialogTrigger>Assign User</DialogTrigger>
          </p>

          <DialogContent className="grid p-0 max-w-[1300px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between bg-primary text-primary-foreground p-2">
              <p>Assign Users to Deal</p>
              <DialogClose>
                <X />
              </DialogClose>
            </div>

            <DialogDescription>
              <AssignUsers dealId={params.dealId} />
            </DialogDescription>
          </DialogContent>
        </Dialog>
        <Dialog>
          <p className="hover:bg-primary hover:text-white p-2 text-center">
            <DialogTrigger>Assign to Working group</DialogTrigger>
          </p>

          <DialogContent className="p-0">
            <div className="flex justify-between bg-primary text-primary-foreground p-2">
              <p>Assign Users to Working Group</p>
              <DialogClose>
                <X />
              </DialogClose>
            </div>
            <DialogDescription>
              <AssignToGroup />
            </DialogDescription>
          </DialogContent>
        </Dialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
