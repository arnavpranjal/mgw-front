"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import BreadCrumb from "@/components/breadcrumb";
import { UserClient } from "@/components/tables/user-mangement-table/client";
import { GroupClient } from "@/components/tables/working-group-table/client";

import { groups } from "@/constants/data";
// import { users } from "@/constants/data";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";
import DynamicForm from "./forms/dynamic-form";
import Link from "next/link";
import { toast } from "@/components/ui/use-toast";
import { Backend_URL } from "@/lib/Constants";

const breadcrumbItems = [
  { title: "Create Deal Page", link: "/dashboard/create-deal" },
];
export default function Page() {
  const [title, setTitle] = React.useState("Create Deal");

  const [formKey, setFormKey] = useState<number>(0);

  const resetForm = () => {
    setFormKey((prevKey) => prevKey + 1);
  };

  async function handleSubmit(data: object) {
    const res = await fetch(Backend_URL + "/deal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (res.status == 401) {
      console.log(res.statusText);
    }

    toast({
      title: `Deal Created!`,
      variant: "default",
      description: `Deal Created Successfully!`,
    });
    console.log(data);

    resetForm();
  }

  function setFormOpen(data: boolean) {
    console.log(data);
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex-1  space-y-4  p-4 md:p-8 pt-6">
          {/* <BreadCrumb items={breadcrumbItems} /> */}
          <Heading title={title} description="" />
          <h3>Create Deal</h3>
          

          <div className="px-4">
            {/* <h5 className="text-xl font-bold mb-4">Deal Summary</h5> */}
            <DynamicForm
              key={formKey}
              onData={handleSubmit}
              setFormOpen={setFormOpen}
            />
            {/* <Tabs defaultValue="widgets" className="space-y-4">
            <TabsList>
              <TabsTrigger value="widgets"><p onClick={()=>setTitle("User management")}>Users</p></TabsTrigger>
              <TabsTrigger value="analytics"><p onClick={()=>setTitle("Group management")}>Groups</p></TabsTrigger>
            </TabsList>
            <TabsContent value="widgets" className="space-y-4">
              <UserClient data={users} />
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <GroupClient data={groups} />
            </TabsContent>
          </Tabs> */}
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
