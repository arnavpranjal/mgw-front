import BreadCrumb from "@/components/breadcrumb";
import { CreateProfileOne } from "@/components/forms/user-profile-stepper/create-profile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagementForm from "./UserManagementForm";
import DealManagementForm from "./dealManagementForm";
import RiskandIssueForm from "./riskAndIssue";

const breadcrumbItems = [
  { title: "Configuration", link: "/dashboard/configuration" },
];
export default function page() {
  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />
        <Tabs defaultValue="UserManagementForm" className="space-y-4">
          <TabsList>
            <TabsTrigger value="UserManagementForm">
              User Management Form
            </TabsTrigger>
            <TabsTrigger value="CreateDealForm">Create Deal Form</TabsTrigger>
            <TabsTrigger value="RiskandIssueForm">
              Risk and Issue Form
            </TabsTrigger>
            <TabsTrigger value="TaskManagementForm">
              Task Management Form
            </TabsTrigger>
          </TabsList>
          <TabsContent value="UserManagementForm" className="space-y-4">
            <UserManagementForm />
          </TabsContent>
          <TabsContent value="CreateDealForm" className="space-y-4">
            <DealManagementForm />
          </TabsContent>
          <TabsContent value="RiskandIssueForm" className="space-y-4">
            <RiskandIssueForm />
          </TabsContent>
          <TabsContent
            value="TaskManagementForm"
            className="space-y-4"
          ></TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}
