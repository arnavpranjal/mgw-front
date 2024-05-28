"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Overview } from "@/components/overview";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { UserClient } from "@/components/tables/user-tables/client";
// import { users } from "@/constants/data";
import Link from "next/link";

export default function Page() {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(true);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  const [isOpen2, setIsOpen2] = useState(true);
  const toggleAccordion2 = () => {
    setIsOpen2(!isOpen2);
  };

  const [isOpen3, setIsOpen3] = useState(true);
  const toggleAccordion3 = () => {
    setIsOpen3(!isOpen3);
  };

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome {session?.user?.name} 👋
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            <h2 className="text-sm font-semi-bold tracking-tight">
              Recent Activities &bull; scheduled a meeting{" "}
              <span className="mx-8 text-muted-foreground">1 hour ago</span>
            </h2>
          </div>
        </div>
        <Tabs defaultValue="widgets" className="space-y-4">
          <TabsList>
            <TabsTrigger value="widgets">Widgets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="widgets" className="space-y-4">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-start-0 col-span-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="shadow-lg ">
                    <Link href={"/dashboard/user-management"}>
                      <CardHeader className="flex flex-col items-center justify-center space-y-0 ">
                        <img
                          src="/images/widgets/user-management.svg"
                          width={50}
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center space-y-0 pb-6">
                        <div className="text-base font-semi-bold">
                          User Management
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Add user / assign them roles
                        </p>
                      </CardContent>
                    </Link>
                  </Card>

                  <Card className="shadow-lg ">
                    <Link href={"/dashboard/create-deal"}>
                      <CardHeader className="flex flex-col items-center justify-center space-y-0 ">
                        <img
                          src="/images/widgets/project-management.svg"
                          width={50}
                        />
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center space-y-0 pb-6 mt-4 ">
                        <div className="text-base font-semi-bold">
                          Create Deal Page
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Add new deal
                        </p>
                      </CardContent>
                    </Link>
                  </Card>

                  <Card className="shadow-lg ">
                    <CardHeader className="flex flex-col items-center justify-center space-y-0 ">
                      <img
                        src="/images/widgets/template-management.svg"
                        width={50}
                      />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-0 pb-6">
                      <div className="text-base font-semi-bold">
                        Template Management
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Create reusable Financial templates
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg ">
                    <CardHeader className="flex flex-col items-center justify-center space-y-0 ">
                      <img src="/images/widgets/localization.svg" width={50} />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-0 pb-6">
                      <div className="text-base font-semi-bold">
                        Localization
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Modify display names of keywords
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg ">
                    <CardHeader className="flex flex-col items-center justify-center space-y-0 ">
                      <img
                        src="/images/widgets/roles-and-permissions.svg"
                        width={50}
                      />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-0 pb-6">
                      <div className="text-base font-semi-bold">
                        Roles And Permission
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Set permissions to actions and add new roles
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg ">
                    <CardHeader className="flex flex-col items-center justify-center space-y-0 ">
                      <img src="/images/widgets/icon_Audit.png" width={50} />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-0 pb-6">
                      <div className="text-base font-semi-bold">
                        Audit Trail
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Track and Monitor Activity History
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg ">
                    <CardHeader className="flex flex-col items-center justify-center space-y-0 ">
                      <img
                        src="/images/widgets/icon_Notification.png"
                        width={50}
                      />
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center space-y-0 pb-6">
                      <div className="text-base font-semi-bold">
                        Notification
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Notification Settings
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
              <div className="col-end-0 col-span-2 pl-6 pt-1">
                {/* todo */}
                <div className="w-full max-w-md mx-auto">
                  <div className="shadow-md">
                    <button
                      className="rounded-md w-full px-2 py-2 flex items-center justify-between bg-primary text-white font-medium"
                      onClick={toggleAccordion}
                    >
                      <span>To-do List</span>
                      <svg
                        className={`w-5 h-5 transition-transform transform ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isOpen && (
                      <div className="px-3 py-3 ">
                        <p>
                          Accordion Content
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full max-w-md mx-auto">
                  <div className="rounded-md shadow-md">
                    <button
                      className="rounded-md w-full px-2 py-2 flex items-center justify-between bg-primary text-white font-medium"
                      onClick={toggleAccordion2}
                    >
                      <span>Meetings</span>
                      <svg
                        className={`w-5 h-5 transition-transform transform ${
                          isOpen2 ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isOpen2 && (
                      <div className="px-2 py-2 ">
                        <p>
                          Accordion Content
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full  mx-auto">
                  <div className="rounded-md shadow-md">
                    <button
                      className="rounded-md w-full px-2 py-2 flex items-center justify-between bg-primary text-white font-medium"
                      onClick={toggleAccordion3}
                    >
                      <span>Announcement</span>
                      <svg
                        className={`w-5 h-5 transition-transform transform ${
                          isOpen3 ? "rotate-180" : "rotate-0"
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {isOpen3 && (
                      <div className="px-4 py-3 ">
                        <p>
                          Accordion Content
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                          <br />
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Onboarded users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">100</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">80/100</div>
                  <p className="text-xs text-muted-foreground">
                    +5.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Blocked Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">20/100</div>
                  <p className="text-xs text-muted-foreground">
                    +1.0% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    License Unused
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">25/125</div>
                  <p className="text-xs text-muted-foreground">
                    +1 since last hour
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-4 md:col-span-4">
                <CardHeader>
                  <CardTitle>Deals</CardTitle>
                  <CardDescription>
                    {/* <UserClient data={users} /> */}
                  </CardDescription>
                </CardHeader>
                <CardContent>{/* <RecentSales /> */}</CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
