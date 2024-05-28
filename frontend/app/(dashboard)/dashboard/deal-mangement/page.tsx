"use client";
import BreadCrumb from "@/components/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet-task";

// import Gantt from ;
import dynamic from "next/dynamic";

const GanttNoSSR = dynamic(() => import("../../../../components/Gantt"), {
  ssr: false, // This line disables server-side rendering
});

import Toolbar from "../../../../components/Toolbar";
import MessageArea from "../../../../components/MessageArea";
import "./styles.css";
import { ReactNode, useEffect, useState } from "react";
import { getData } from "./data.js";
import { Icons } from "@/components/icons";
import {
  AiOutlinePlusCircle,
  AiOutlineEdit,
  AiOutlineDelete,
} from "react-icons/ai";
import { Heading } from "@/components/ui/heading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";
import { tuple } from "zod";
import { Backend_URL } from "@/lib/Constants";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { Select } from "@/components/ui/select";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Stream } from "stream";
import { useRouter } from "next/navigation";
import queryString from "query-string";
import { json } from "stream/consumers";
import Assignment from "./assignment/page";

type Message = string;

const breadcrumbItems = [
  { title: "Deal Mangement", link: "/dashboard/deal-mangement" },
];

async function fetchtask(groupId: string, phase: string, dealId: string) {
  console.log({ phase, dealId, groupId });
  const response = await fetch(
    Backend_URL + `/task?phase=${phase}&dealid=${dealId}&group=${groupId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return { data: data, links: [] };
}

async function fetchStreamGroup(dealId: string) {
  console.log(dealId);
  const response = await fetch(
    Backend_URL + "/task/entity?type=Stream group&dealId=" + dealId
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

async function fetchDeals() {
  const response = await fetch(Backend_URL + "/deal");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return data;
}

export default function Page() {
  const router = useRouter();
  const [currentZoom, setZoom] = useState("Days");
  const [callapsAll, setCollapseAll] = useState(false);
  const [openDrawer, setDrawer] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [groupId, setGroupId] = useState("");
  const [sgDate, setSgDate] = useState({ startDate: "", endDate: "" });
  const [dealSelect, setDealSelect] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("dealSelect") || "";
    }
    return "";
  });
  const [dealDetails, setDealDetails] = useState({
    index: "",
    id: "",
    phase: "",
    name: "",
  });

  const [open, setOpen] = useState(false);
  const [streamGroupModal, setStreamGroupModal] = useState(false);

  const [task, setTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    type: "",
  });

  const [addtask, setAddTask] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    priority: "Medium",
    type: "",
    label: "",
    parent: "0",
    group: "",
    parentStartDate: "",
    parentEndDate: "",
  });

  const {
    data: taskData,
    error,
    isLoading,
    refetch,
  } = useQuery("task", () =>
    fetchtask(groupId, dealDetails?.phase, dealDetails?.id)
  );

  const {
    data: SreamGroup,
    error: error2,
    isLoading: loading,
    refetch: refetch2,
  } = useQuery("streamgroup", () => fetchStreamGroup(dealDetails?.id));

  const {
    data: Deals,
    error: error3,
    isLoading: loading3,
    refetch: refetch3,
  } = useQuery("deals", fetchDeals);

  const addMessage = (message: any) => {
    setMessages((arr) => [...arr, message]);
  };

  function loaddata(value: string) {
    const [index, id, phase, name] = value.split(" ");
    setDealDetails({ index, id, phase, name });

    // storing data in session
    sessionStorage.setItem(
      "dealData",
      JSON.stringify({
        index: index,
        id: id,
        dealname: name,
        phase: phase,
      })
    );
  }

  // intialise deals start
  useEffect(() => {
    setTimeout(() => {
      refetch2();
      refetch();
    }, 150);
  }, [dealDetails]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("dealData") || "";

      if (Deals) {
        if (storedData == "") {
          setDealDetails({
            index: "0",
            id: Deals[0].id,
            phase: Deals[0].details["Deal Phase"],
            name: Deals[0].details["Deal Name"],
          });
        } else {
          const data = JSON.parse(storedData);
          setDealDetails({
            index: data.index,
            id: data.id,
            phase: data.phase,
            name: data.dealname,
          });
        }
      }
    }
  }, [Deals]);

  useEffect(() => {
    if (SreamGroup) {
      setGroupId(SreamGroup[0]?.id);
    }
  }, [SreamGroup]);

  useEffect(() => {
    // console.log(groupId);
    setTimeout(() => {
      refetch();
    }, 150);
  }, [groupId]);

  // intialise deals end

  const handleEditTask = (
    id: string,
    title: string,
    startDate: string,
    endDate: string
  ) => {
    setDrawer(true);
    setTask({
      ...task,
      title: title,
      startDate: "",
      endDate: "",
    });
    console.log({
      id,
      title,
      startDate,
      endDate,
    });
  };
  const handleAddTask = (
    id: number,
    type: string,
    group: string,
    start_date: string,
    end_date: string
  ) => {
    console.log({ start_date, end_date });
    const etityType = type == "Stream" ? "Task group" : "Task";
    setAddTask({
      ...addtask,
      parent: `${id}`,
      type: etityType,
      group: group,
      parentStartDate: formatLongDate(start_date),
      parentEndDate: formatLongDate(end_date),
    });
    setOpen(true);
    console.log(new Date(addtask.parentStartDate));
  };

  function logDataUpdate(
    type: string,
    action: string,
    item: { text: any; source: any; target: any },
    id: any
  ) {
    let text = item && item.text ? ` (${item.text})` : "";
    let message = `${type} ${action}: ${id} ${text} `;
    if (type === "link" && action !== "delete") {
      message += ` ( source: ${item.source}, target: ${item.target} )`;
    }
    addMessage(message);
  }

  const handleSubmit = async (e?: any, type?: string) => {
    e.preventDefault();
    setOpen(false);
    // console.log(e.target[3].value)
    // console.log(e.target[4].value)
    // console.log(e.target[5].value)

    const startDate = dayjs(addtask.startDate || e.target["startDate"].value);
    const endDate = dayjs(addtask.endDate || e.target["endDate"].value);
    // console.log({ startDate, endDate });
    // Calculate the duration in days
    const durationInDays = endDate.diff(startDate, "day");
    console.log(durationInDays);
    try {
      const response = await fetch(Backend_URL + "/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: addtask.title,
          start_date: startDate.format("DD-MM-YYYY"),
          end_date: endDate.format("DD-MM-YYYY"),
          duration: durationInDays,
          type: type || addtask.type,
          label: addtask.label,
          priority: addtask.priority,
          order: 1,
          progress: 0.0,
          parent: addtask.parent,
          group: addtask.group,
          dealId: dealDetails?.id,
          phase: dealDetails?.phase,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        refetch();
        refetch2();
      }

      // Handle success response
      console.log("Post request successful");
      setAddTask({
        ...addtask,
        title: "",
        description: "",
        startDate: "",
        endDate: "",
        priority: "Medium",
        type: "",
        label: "",
        parent: "0",
        group: "",
        // parentStartDate: "",
        // parentEndDate: "",
      });
    } catch (error) {
      // Handle error
      console.error("There was a problem with the POST request:", error);
    }
  };

  function formatDate(originalDate: string) {
    // Split the original date string into day, month, and year components
    const parts = originalDate.split("-");

    // Rearrange the components to the desired format (YYYY-MM-DD)
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;

    return formattedDate;
  }

  function formatLongDate(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  if (loading3 && isLoading && loading) return "Loading...";
  if (error) return "An error has occurred: " + error;

  // console.log(Deals[0].details['Phase Start Date']);
  // console.log(Deals[0].details['Phase End Date']);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-2 p-1 md:p-8 pt-6">
        <BreadCrumb items={breadcrumbItems} />

        <div className="bg-gray-100 p-2">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2 ">
              <div>
                <label htmlFor="deal" className="sr-only">
                  Deal
                </label>
                <select
                  id="deal"
                  name="deal"
                  className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  style={{ minWidth: "150px" }}
                  value={dealSelect}
                  onChange={(e) => {
                    // setTimeout(()=>{
                    loaddata(e.target.value);
                    console.log(e.target.value);
                    setDealSelect(e.target.value);
                    sessionStorage.setItem("dealSelect", e.target.value);
                    // },200)
                  }}
                >
                  {Deals?.map((deal: any, index: number) => {
                    return (
                      <option
                        key={deal.id + index}
                        value={`${index} ${deal.id} ${deal?.details[
                          "Deal Phase"
                        ]} ${deal.details?.["Deal Name"]?.replaceAll(
                          " ",
                          "-"
                        )}`}
                      >
                        {deal.details?.["Deal Name"] || deal.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label htmlFor="phase" className="sr-only">
                  Phase
                </label>
                <select
                  id="phase"
                  name="phase"
                  className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  style={{ minWidth: "150px" }}
                >
                  <option value={dealDetails.phase}>{dealDetails.phase}</option>
                </select>
              </div>

              {/* <div>
                <label htmlFor="phase-status" className="sr-only">
                  Phase Status
                </label>
                <select
                  id="phase-status"
                  name="phase-status"
                  className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  style={{ minWidth: "150px" }}
                >
                  <option>Phase Status</option>
                </select>
              </div> */}
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm font-semibold ">54%</div>

              <div className="text-sm text-gray-600 font-semibold">
                <span>Phase Start</span>
                <span>- </span>
                <span>01 Feb &apos;23 </span>
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                <span>Phase End </span>
                <span>- </span>
                <span>17 May &apos;23</span>
              </div>

              <button className="text-xs inline-flex items-center px-2 py-1 border border-transparent text-sm font-medium rounded-sm shadow-sm text-white bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Export as PPT
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-screen-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-0">
              <Tabs defaultValue="widgets" className="space-y-0">
                <TabsList>
                  <TabsTrigger value="widgets">
                    <p>Gantt</p>
                  </TabsTrigger>
                  <TabsTrigger value="analytics">
                    <p>Board</p>
                  </TabsTrigger>
                </TabsList>
                <TabsContent
                  value="widgets"
                  className="space-y-4"
                ></TabsContent>
                <TabsContent
                  value="analytics"
                  className="space-y-4"
                ></TabsContent>
              </Tabs>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex flex-wrap gap-2">
                <button
                  className="text-sm  bg-white hover:bg-gray-100 text-gray-800 font-semibold  rounded-md flex items-center justify-center "
                  style={{ minWidth: "150px" }}
                  onClick={() => {
                    router.push(
                      "/dashboard/deal-mangement/edit-deal/edit/" +
                        dealDetails?.id
                    );
                  }}
                >
                  <Icons.editicon width={15} /> &nbsp; Edit Deal
                </button>

                <button
                  className="text-sm  bg-white hover:bg-gray-100 text-gray-800 font-semibold  rounded-md flex items-center justify-center w-32"
                  style={{ minWidth: "150px" }}
                >
                  <Icons.Risk width={15} /> &nbsp; Risk
                </button>
                <button
                  className="text-sm  bg-white hover:bg-gray-100 text-gray-800 font-semibold  rounded-md flex items-center justify-center w-32"
                  style={{ minWidth: "150px" }}
                  onClick={() => {
                    const queryParams = { pram: dealDetails.phase };
                    const queryStringified = queryString.stringify(queryParams);

                    router.push(`/dashboard/vdr?${queryStringified}`);
                  }}
                >
                  <Icons.Cloud width={15} /> &nbsp; VDR
                </button>
                <Assignment params={{dealId:parseInt(dealDetails?.id)}}/>
                <button
                  className="text-sm  bg-white hover:bg-gray-100 text-gray-800 font-semibold px-4 py-2 rounded-md flex items-center justify-center w-32"
                  style={{ minWidth: "150px" }}
                >
                  <Icons.Template width={15} /> &nbsp; Template
                </button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="widgets" className="space-y-0">
          <TabsContent value="widgets" className="">
            <div className="bg-gray-100 p-2 flex scrollable-div-gantt">
              {SreamGroup?.map(
                (
                  data: {
                    id: number;
                    text: string;
                    progress: string;
                    start_date: string;
                    end_date: string;
                  },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex-shrink-0 px-3 h-18 bg-white rounded-md relative mr-2 cursor-pointer"
                    onClick={() => {
                      setGroupId(`${data?.id}`);
                      setTimeout(() => {
                        refetch();
                      }, 200);
                    }}
                  >
                    <div className="p-1 flex justify-center items-center">
                      <div className="font-semi-bold text-sm">{data?.text}</div>
                      &nbsp;&nbsp;
                      <div className="text-xs p-0 bg-gray-200 rounded-sm">
                        {data?.progress}
                      </div>
                    </div>
                    <div className="p-1 flex justify-evenly items-center">
                      <button
                        onClick={() => {
                          setAddTask({
                            ...addtask,
                            type: "Stream",
                            group: `${data?.id}`,
                            parentStartDate: formatDate(data.start_date),
                            parentEndDate: formatDate(data.end_date),
                          });
                          setOpen(true);
                        }}
                        className="bg-gray-100 hover:bg-gray-300 text-green-500 hover:text-green-700 rounded-full p-1 focus:outline-none"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#414042"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </button>
                      {/* Edit Button */}
                      <button
                        // onclick="myFunction('${task.id}','${task.text}','${task.start_date}','${task.end_date}',)"
                        className="bg-gray-100 hover:bg-gray-300 text-green-500 hover:text-green-700 rounded-full p-1 focus:outline-none"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#414042"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      <button
                        // onclick="clickGridButton(${task.id}, 'delete')"
                        className="bg-gray-100 hover:bg-gray-300 text-red-500 hover:text-red-700 rounded-full p-1 focus:outline-none"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#414042"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"
                          />
                        </svg>
                      </button>

                      <button
                        // onclick="clickGridButton(${task.id}, 'warning')"
                        className="bg-gray-100 hover:bg-gray-300 text-yellow-500 hover:text-yellow-700 rounded-full p-1 focus:outline-none"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#414042"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                      </button>

                      <button
                        onClick={() => {
                          router.push(`/dashboard/vdr`);
                        }}
                        className="bg-gray-100 hover:bg-gray-300 text-blue-500 hover:text-blue-700 rounded-full p-1 focus:outline-none"
                      >
                        <svg
                          className="h-3.5 w-3.5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#414042"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              )}
              <div className="flex-shrink-0 w-40 h-18 bg-white rounded-md relative mr-2">
                <div className="p-1 flex justify-center items-center">
                  <div
                    className="font-semi-bold text-sm pt-4 cursor-pointer"
                    onClick={() => setStreamGroupModal(true)}
                  >
                    Add
                  </div>
                </div>
                <div className="p-1 flex justify-evenly items-center"></div>
              </div>
            </div>
            <div className="gantt-container">
              <div className=" flex justify-between items-center border border-gray-200 p-1">
                <div className="flex gap-3 ">
                  <button
                    className="bg-white border-0 border-gray-200 text-gray-700 px-2 py-1 rounded shadow-sm hover:shadow focus:outline-none focus:border-blue-300 flex items-center justify-center"
                    style={{ borderColor: "rgba(200, 200, 200, 0.5)" }}
                  >
                    <div className="flex items-center space-x-0">
                      <Checkbox id="terms" />
                    </div>
                  </button>
                  <button
                    className="text-sm bg-white border-0 border-gray-200 text-gray-700 px-2 py-1 rounded shadow-sm hover:shadow focus:outline-none focus:border-blue-300 flex items-center justify-center"
                    style={{ borderColor: "rgba(200, 200, 200, 0.5)" }}
                    onClick={() => setCollapseAll(false)}
                  >
                    <svg
                      width="12px" // Reduced size to fit the smaller button
                      height="12px"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      x="0px"
                      y="0px"
                      viewBox="0 0 512 512"
                      style={{ marginRight: "4px" }} // Adjusted for smaller padding
                      xmlSpace="preserve"
                    >
                      <g id="XMLID_2_">
                        <path
                          id="XMLID_6_"
                          d="M256,80.2l90.5,90.5l40.1-40.1L256,0L125.4,130.6l40.1,40.1L256,80.2z M256,431.8l-90.5-90.5l-40.1,40.1
		                     L256,512l130.6-130.6l-40.1-40.1L256,431.8z"
                        />
                      </g>
                    </svg>
                    Expand all
                  </button>

                  <button
                    className="text-sm bg-white border-0 border-gray-200 text-gray-700 px-2 py-1 rounded shadow-sm hover:shadow focus:outline-none focus:border-blue-300 flex items-center justify-center"
                    style={{ borderColor: "rgba(200, 200, 200, 0.5)" }}
                    onClick={() => setCollapseAll(true)}
                  >
                    <svg
                      width="11px" // Reduced size to fit the smaller button
                      height="11px" // Reduced size to fit the smaller button
                      viewBox="0 0 16 16"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      style={{ marginRight: "4px" }} // Adjusted for smaller padding
                    >
                      <rect
                        width={16}
                        height={16}
                        id="icon-bound"
                        fill="none"
                      />
                      <path
                        id="expand-collapse"
                        d="M4.414,15.414L8,11.828L11.586,15.414L13,14L8,9L3,14L4.414,15.414ZM11.586,0.586L8,4.172L4.414,0.586L3,2L8,7L13,2L11.586,0.586Z"
                        style={{ fillRule: "nonzero" }}
                      />
                    </svg>
                    Collapse all
                  </button>
                </div>
                <div className=" ml-auto">
                  <Toolbar zoom={currentZoom} setZoom={setZoom} />
                </div>
                <div className="ml-3">
                  <button
                    className="text-sm bg-white border-0 border-gray-200 text-gray-700 px-2 py-1 rounded shadow-sm hover:shadow focus:outline-none focus:border-blue-300 flex items-center justify-center"
                    style={{ borderColor: "rgba(200, 200, 200, 0.5)" }}
                  >
                    <Icons.Filters width={13} height={13} />{" "}
                    Filter&nbsp;&nbsp;&nbsp;
                  </button>
                </div>
              </div>

              <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                  <DialogHeader>
                    <h3>Add {addtask.type}</h3>
                  </DialogHeader>
                  <form
                    onSubmit={(e) => {
                      handleSubmit(e);
                    }}
                  >
                    <div className="grid gap-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={addtask.title}
                          onChange={(e) =>
                            setAddTask({ ...addtask, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={addtask.description}
                          onChange={(e) =>
                            setAddTask({
                              ...addtask,
                              description: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      {(addtask.type == "Task" ||
                        addtask.type == "milestone") && (
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <select
                            id="type"
                            value={addtask.type}
                            onChange={(e) =>
                              setAddTask({
                                ...addtask,
                                type: e.target.value,
                              })
                            }
                            className="mt-1 block w-full pl-3 pr-10 py-[6px] text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                          >
                            <option value={"Task"}>Task</option>
                            <option value={"milestone"}>Milestone</option>
                          </select>
                        </div>
                      )}

                      {addtask.type == "milestone" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              type="date"
                              name="startDate"
                              defaultValue={addtask.parentEndDate} // Convert Date to string
                              onChange={
                                (e) => {
                                  console.log(e.target.value);
                                  setAddTask({
                                    ...addtask,
                                    startDate: e.target.value,
                                  });
                                } // Convert string to Date
                              }
                              min={addtask.parentStartDate}
                              max={addtask.parentEndDate}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              type="date"
                              name="endDate"
                              defaultValue={addtask.parentEndDate}
                              // defaultValue={Deals[dealDetails?.index||0].details['Phase End Date']}
                              // defaultValue={"14-05-2024"}
                              onChange={
                                (e) =>
                                  setAddTask({
                                    ...addtask,
                                    endDate: e.target.value,
                                  }) // Convert string to Date
                              }
                              min={addtask.parentStartDate}
                              max={addtask.parentEndDate}
                              required
                            />
                          </div>
                        </div>
                      )}

                      {addtask.type != "milestone" && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              name="startDate"
                              type="date"
                              defaultValue={addtask.parentStartDate} // Convert Date to string
                              onChange={
                                (e) => {
                                  console.log(e.target.value);
                                  setAddTask({
                                    ...addtask,
                                    startDate: e.target.value,
                                  });
                                } // Convert string to Date
                              }
                              min={addtask.parentStartDate}
                              max={addtask.parentEndDate}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              name="endDate"
                              type="date"
                              defaultValue={addtask.parentEndDate}
                              // defaultValue={Deals[dealDetails?.index||0].details['Phase End Date']}
                              // defaultValue={"14-05-2024"}
                              onChange={
                                (e) =>
                                  setAddTask({
                                    ...addtask,
                                    endDate: e.target.value,
                                  }) // Convert string to Date
                              }
                              min={addtask.parentStartDate}
                              max={addtask.parentEndDate}
                              required
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="priority">Priority</Label>
                        <select
                          id="priority"
                          value={addtask.priority}
                          onChange={(e) =>
                            setAddTask({
                              ...addtask,
                              priority: e.target.value,
                            })
                          }
                          className="mt-1 block w-full pl-3 pr-10 py-[6px] text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          required
                        >
                          <option value={"critical"}>Critical</option>
                          <option value={"High"}>High</option>
                          <option value={"Medium"}>Medium</option>
                          <option value={"Low"}>Low</option>
                        </select>
                      </div>
                    </div>
                    <DialogFooter className="mt-4">
                      <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                      </Button>
                      <Button>Create</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
              {isLoading ? (
                ""
              ) : (
                <GanttNoSSR
                  tasks={taskData}
                  zoom={currentZoom}
                  onDataUpdated={logDataUpdate}
                  handleEditTask={handleEditTask}
                  handleAddTask={handleAddTask}
                  callapsAll={callapsAll}
                />
              )}

              {/* <MessageArea messages={messages} /> */}
              <br />
              <br />
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4"></TabsContent>
        </Tabs>
      </div>

      <Sheet
        open={
          openDrawer
          // true
        }
      >
        <SheetContent className="w-[50%] mt-[31.8vh]">
          <SheetHeader>
            <SheetDescription>
              Deal name/ Phase/ Stream Group name/ Stream Name/ Task Group Name/
              Task Name
            </SheetDescription>
            <SheetTitle>Task Name</SheetTitle>
          </SheetHeader>
          <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-900" />
          <div className="grid py-4">
            <div className="grid grid-cols-3 ">
              <div className="bg-white  p-4 mt-2">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-md h-8 mr-2">
                    <div
                      className="bg-teal-500 h-8 rounded-md"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                  &nbsp;&nbsp;&nbsp;<b>70%</b>
                </div>
              </div>
              <div className="bg-white p-4">
                <div className="flex space-x-2">
                  <button className="bg-gray-200 px-3 py-1 flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                    <span className="text-gray-600 text-sm font-small">
                      IN PROGRESS
                    </span>
                  </button>
                  <button className="bg-gray-200 px-3 py-1 flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span className="text-gray-600 text-sm font-small">
                      MEDIUM
                    </span>
                  </button>
                </div>
              </div>
              <div className="bg-white  p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-md px-2 py-1 mr-2">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-600 font-medium text-xs">
                      21/02/2024
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-md px-2 py-1 mr-2">
                      <svg
                        className="w-4 h-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-600 font-medium text-xs">
                      26/02/2024
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={task.title}
                  onChange={(e) => setTask({ ...task, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={task.description}
                  onChange={(e) =>
                    setTask({ ...task, description: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={task.startDate.toISOString().split("T")[0]} // Convert Date to string
                    onChange={
                      (e) =>
                        setTask({
                          ...task,
                          startDate: new Date(e.target.value),
                        })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={task.endDate.toISOString().split("T")[0]} // Convert Date to string
                    onChange={
                      (e) =>
                        setTask({
                          ...task,
                          endDate: new Date(e.target.value),
                        }) // Convert string to Date
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  value={task.priority}
                  onChange={(e) =>
                    setTask({ ...task, priority: e.target.value })
                  }
                />
              </div>
            </div> */}
          </div>

          <SheetFooter>
            <SheetClose asChild>
              <Button className="bg-primary" onClick={() => setDrawer(false)}>
                Close
              </Button>
            </SheetClose>
            <Button onClick={() => setDrawer(false)}> Save </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Stream group modal */}
      <Dialog open={streamGroupModal}>
        <DialogContent>
          <DialogHeader>
            <h3>Add Stream Group</h3>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              handleSubmit(e, "Stream group");
              setStreamGroupModal(false);
            }}
          >
            <div className="grid gap-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={addtask.title}
                  onChange={(e) =>
                    setAddTask({ ...addtask, title: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={addtask.description}
                  onChange={(e) =>
                    setAddTask({
                      ...addtask,
                      description: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    defaultValue={
                      Deals
                        ? Deals[dealDetails?.index || 0]?.details[
                            "Phase Start Date"
                          ]
                        : ""
                    } // Convert Date to string
                    onChange={
                      (e) => {
                        console.log(e.target.value);
                        setAddTask({
                          ...addtask,
                          startDate: e.target.value,
                        });
                      } // Convert string to Date
                    }
                    min={
                      Deals
                        ? Deals[dealDetails?.index || 0]?.details[
                            "Phase Start Date"
                          ]
                        : ""
                    }
                    max={
                      Deals
                        ? Deals[dealDetails?.index || 0]?.details[
                            "Phase End Date"
                          ]
                        : ""
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    defaultValue={
                      Deals
                        ? Deals[dealDetails?.index || 0]?.details[
                            "Phase End Date"
                          ]
                        : ""
                    } // Convert Date to string
                    onChange={
                      (e) =>
                        setAddTask({
                          ...addtask,
                          endDate: e.target.value,
                        }) // Convert string to Date
                    }
                    min={
                      Deals
                        ? Deals[dealDetails?.index || 0]?.details[
                            "Phase Start Date"
                          ]
                        : ""
                    }
                    max={
                      Deals
                        ? Deals[dealDetails?.index || 0]?.details[
                            "Phase End Date"
                          ]
                        : ""
                    }
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setStreamGroupModal(false)}
              >
                Cancel
              </Button>
              <Button>Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );

  // }
}

// page ends new