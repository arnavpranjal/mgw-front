"use client"
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
import React from "react";

const breadcrumbItems = [
  { title: "User management", link: "/dashboard/user-management" },
];
export default function Page() {

  const [title,setTitle]=React.useState("User management")
  let breadcrumbItems = [
    { title: title, link: "/dashboard/user-management" },
  ];

  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex-1 space-y-4  p-4 md:p-8 pt-6">
          <BreadCrumb items={breadcrumbItems} />
          <Heading title={title} description="" />

          <Tabs defaultValue="widgets" className="space-y-4">
            <TabsList>
              <TabsTrigger value="widgets"><p onClick={()=>setTitle("User management")}>Users</p></TabsTrigger>
              <TabsTrigger value="analytics"><p onClick={()=>setTitle("Group management")}>Groups</p></TabsTrigger>
            </TabsList>
            <TabsContent value="widgets" className="space-y-4">
              <UserClient data={[]}  />
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <GroupClient data={groups} />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </>
  );
}
