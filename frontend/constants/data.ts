import { Icons } from "@/components/icons";
import { NavItem, SidebarNavItem } from "@/types";
import { CircleIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";

export type User = {
  Role: any;
  id: number;
  name: string;
  role: string;
  email: string;
  country: string;
  lastLogin: string;
  assignedToDeal: string;
  verified: boolean;
  status: string;
};
// export const users: User[] = [
//   {
//     id: 1,
//     name: "Candice Schiner",
//     role: "Admin",
//     email: "Candice@gmail.com",
//     country: "USA",
//     lastLogin: "18/04/2012 15:07:33",
//     assignedToDeal: "jbcart",
//     verified: false,
//     status: "Active",
//   },
//   {
//     id: 2,
//     name: "John Doe",
//     role: "Team member",
//     email: "test@gmail.com",
//     country: "USA",
//     lastLogin: "18/04/2012 15:07:33",
//     assignedToDeal: "abc",
//     verified: true,
//     status: "Active",
//   },
//   {
//     id: 3,
//     name: "John Doe",
//     role: "Team member",
//     email: "test@gmail.com",
//     country: "USA",
//     lastLogin: "18/04/2012 15:07:33",
//     assignedToDeal: "abc",
//     verified: true,
//     status: "Active",
//   },
//   {
//     id: 4,
//     name: "John Doe",
//     role: "Team member",
//     email: "test@gmail.com",
//     country: "USA",
//     lastLogin: "18/04/2012 15:07:33",
//     assignedToDeal: "abc",
//     verified: true,
//     status: "Active",
//   },
// ];

export type Groups = {
  id: number;
  name: string;
  description: string;
};
export const groups: Groups[] = [
  {
    id: 1,
    name: "Fianace",
    description: "Fianace Group Description",
  },
  {
    id: 2,
    name: "Legal",
    description: "Legal Group Description",
  },
  {
    id: 3,
    name: "Test",
    description: "Test Group Description",
  },
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },
  // {
  //   title: "User",
  //   href: "/dashboard/user",
  //   icon: "user",
  //   label: "user",
  // },
  {
    title: "Deal Mangement",
    href: "/dashboard/deal-mangement",
    icon: "dashboard",
    label: "deal-mangement",
  },
  // {
  //   title: "Profile",
  //   href: "/dashboard/profile",
  //   icon: "profile",
  //   label: "profile",
  // },
  // {
  //   title: "Kanban",
  //   href: "/dashboard/kanban",
  //   icon: "kanban",
  //   label: "kanban",
  // },
  {
    title: "configuration",
    href: "/dashboard/configuration",
    icon: "kanban",
    label: "kanban",
  },
  {
    title: "localization",
    href: "/dashboard/localization",
    icon: "kanban",
    label: "kanban",
  },


  
];

export const dyform = [
  {
    type: "text",
    name: "firstName",
    placeholder: "Enter your first name",
    label: "First Name",
  },
  {
    type: "text",
    name: "lastName",
    placeholder: "Enter your last name",
    label: "Last Name",
  },
  {
    type: "email",
    name: "email",
    placeholder: "Enter your email",
    label: "Email",
  },
  {
    type: "number",
    name: "mobile",
    placeholder: "Enter your mobile no",
    label: "Mobile No",
  },
  {
    type: "select",
    name: "country",
    placeholder: "Select Your Country",
    label: "Country",
    options: ["USA", "CANADA"],
  },
  {
    type: "select",
    name: "role",
    placeholder: "Select Your Role",
    label: "Global Role",
    options: ["Role 1", "Role 2"],
  },
];

export const priorities = [
  {
    value: "Admin",
    label: "Admin",
    icon: QuestionMarkCircledIcon,
  },
  {
    value: "Integration Manager",
    label: "Integration Manager",
    icon: CircleIcon,
  },
];

export const Roles = [
  "Admin",
  "Integration Manager",
  "Deal Sponsor",
  "Program Manager",
  "Stream Manager",
  "Team Member",
  "Blocked User",
];
