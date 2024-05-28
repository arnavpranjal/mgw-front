"use client";

import Select, { components } from "react-select";
import { Backend_URL } from "@/lib/Constants";
import { useQuery } from "react-query";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";

interface CustomField {
    requiredfield: boolean;
    active?: boolean;
    name: string;
    label: string;
    type: string;
    placeholder: string;
    options?: string[];
    subCategory: string;
}

interface DynamicFormProps {
    onData: (data: object) => void;
    id: any;
}

const { Option } = components;

const ImageOption = (props: any) => (
    <Option {...props}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar style={{ display: "inline", width: "25px", height: "25px" }}>
                <AvatarImage
                    src="https://github.com/shadcn.png"
                    // className="w-5 h-5"
                    alt=""
                />
            </Avatar>
            &nbsp;&nbsp;
            <span> {props.data.label}</span>
        </div>
    </Option>
);

async function fetchDisplayStages() {
    const response = await fetch(Backend_URL + `/stages`);
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

async function fetchCustomFeilds() {
    const response = await fetch(Backend_URL + "/customfeilds?category=deal");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

async function fetchUsersData() {
    const response = await fetch(Backend_URL + "/user/all");
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json();
}

async function fetchDeal(id: any) {
    const response = await fetch(Backend_URL + `/deal/${id}`);
    const data = await response.json();
    return data;
}

export default function Page({ params }: { params: { id: number } }) {
    return (
        <DynamicForm id={params.id} onData={function (data: object): void { }} />
    );
}



const DynamicForm: React.FC<DynamicFormProps> = ({ onData, id }) => {
    const { data: session } = useSession();

    const [formData, setFormData] = useState<any>({});
    const [dealOwner, setDealOwner] = useState(session?.user.name);
    const [selectedStage, setSelectedStage] = useState<any>({});
    const [formSubmitted, setFormSubmitted] = useState(false);



    const formRef = useRef<HTMLFormElement>(null);

    const { data: customfeilds, error, isLoading, refetch } = useQuery("dynamic-fields", fetchCustomFeilds);

    const { data: users, isLoading: userLoading } = useQuery("users", fetchUsersData);

    const { data: stages, isLoading: rolesLoading } = useQuery("roles", fetchDisplayStages);

    const { data: deals, isLoading: dealLoading, isError: dealerror,refetch:dealRefetch } = useQuery(["deal", id], () => fetchDeal(id));


    useEffect(() => {
        if (deals) {
            setFormData(deals.details);
            setDealOwner(deals.details["deal owner"]);
            setSelectedStage(deals.details?.selectedStages ?? {})
        }
    }, [deals]);


    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };


    const handleDateChange = (field: string, value: string) => {
        const updatedFormData = { ...formData, [field]: value };
        setFormData(updatedFormData);
    };


    const handleCheckboxChange = (systemName: string, value: boolean) => {
        if (deals.details.selectedStages?.[systemName]?.isSelected) {
            setSelectedStage({ ...selectedStage, [systemName]: { ...selectedStage[systemName], isSelected: true } });
        }
        else {
            setSelectedStage({ ...selectedStage, [systemName]: { ...selectedStage[systemName], isSelected: value } });
        }
    }


    const handleSelectedDateChange = (systemName: string, type: string, value: any) => {
        setSelectedStage({ ...selectedStage, [systemName]: { ...selectedStage[systemName], [type]: value } });
    }


    const handleSubmit = async (event: any) => {
        event.preventDefault();

        onData({ ...formData, "deal owner": dealOwner });
        console.log({ ...formData, "deal owner": dealOwner, "selectedStages": selectedStage });

        try {
            const response = await fetch(Backend_URL + `/deal/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, "deal owner": dealOwner, "selectedStages": selectedStage }),
            });
            if (!response.ok) {
                throw new Error("Failed to submit data");
            }
            toast({
                title: `Deal Updated!`,
                variant: "default",
                description: `Deal Updated Successfully!`,
            });
        } catch (error) {
            console.error("Error submitting data:", error);
        }
        setFormSubmitted(true);
        dealRefetch();
    };



    if (dealLoading || userLoading || isLoading || rolesLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="overflow-auto h-full">
            <h5 className="text-3xl font-bold m-3 ">Edit Deal</h5>

            <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-6  p-4 md:p-8 pt-6"
            >
                <h5 className="text-xl font-bold mb-4">Deal Summary</h5>
                <div className="grid grid-cols-2 gap-6">
                    {customfeilds?.map((field: CustomField, index: any) => {
                        if (field.subCategory == "Deal Summary") {
                            if (field?.active == true) {
                                switch (field.type) {
                                    case "text":
                                    case "number":
                                    case "date":
                                        return (
                                            <div>
                                                <label
                                                    htmlFor={field?.name}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {field.label}{" "}
                                                    {field.requiredfield && (
                                                        <span style={{ color: "red" }}>*</span>
                                                    )}
                                                </label>
                                                <input
                                                    type={field.type}
                                                    id={field.name}
                                                    name={field.name}
                                                    placeholder={field.placeholder}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required={field.requiredfield}
                                                />
                                            </div>
                                        );

                                    case "select":
                                        return (
                                            <div>
                                                <label
                                                    htmlFor={field?.name}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {field.label}{" "}
                                                    {field.requiredfield && (
                                                        <span style={{ color: "red" }}>*</span>
                                                    )}
                                                </label>
                                                <select
                                                    id={field.name}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required={field.requiredfield}
                                                >
                                                    <option value="">{field.placeholder}</option>
                                                    {field.options?.map((option, index) => (
                                                        <option key={`${index}-optdynamic`} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        );

                                    case "User Select":
                                        return (
                                            <div className="">
                                                <label
                                                    htmlFor={field?.name}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {field.label}{" "}
                                                    {field.requiredfield && (
                                                        <span style={{ color: "red" }}>*</span>
                                                    )}
                                                </label>
                                                <Select
                                                    options={users.map((user: any) => {
                                                        return { value: user.name, label: user.name };
                                                    })}
                                                    value={{ value: dealOwner, label: dealOwner }}
                                                    onChange={(value: any) => {
                                                        // console.log(value.value)
                                                        setDealOwner(value.value);
                                                    }}
                                                    isSearchable={true}
                                                    components={{ Option: ImageOption }}
                                                    placeholder="Select an option..."
                                                />
                                            </div>
                                        );
                                    default:
                                        return null;
                                }
                            }
                        }
                    })}
                </div>

                <h5 className="text-xl font-bold mb-4">Phase Information</h5>
                <Table className="text-center mt-4 max-w-3xl">
                    <TableHeader>
                        <TableRow className="font-bold">
                            <TableCell>Phases</TableCell>
                            <TableCell>Add to Deal</TableCell>
                            <TableCell>Phases Start Date</TableCell>
                            <TableCell>Phases End Date</TableCell>
                            <TableCell>% Completion</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stages && stages.map((stage: any, index: any) => {
                            const isDealPhase = stage.displayName === deals.details["Deal Phase"];

                            return (
                                <TableRow key={index}>
                                    <TableCell>{stage.displayName}</TableCell>
                                    <TableCell>
                                        {
                                            isDealPhase ?
                                                <Checkbox checked={isDealPhase} />
                                                :
                                                <Checkbox
                                                    checked={selectedStage?.[stage?.systemName]?.isSelected}
                                                    onCheckedChange={(checked: boolean) => handleCheckboxChange(stage?.systemName, checked)}
                                                />
                                        }
                                    </TableCell>
                                    <TableCell>
                                        {isDealPhase ? (
                                            <input
                                                type="date"
                                                value={formData["Phase Start Date"] || deals.details["Phase Start Date"]}
                                                min={deals.details["Deal Start Date"]}
                                                max={deals.details["Deal End Date"]}
                                                onChange={(e) =>
                                                    handleDateChange("Phase Start Date", e.target.value)
                                                }
                                            />
                                        ) :
                                            <input
                                                type="date"
                                                value={selectedStage?.[stage?.systemName]?.startDate || deals.details["Deal Start Date"]}
                                                min={deals.details["Deal Start Date"]}
                                                max={deals.details["Deal End Date"]}
                                                onChange={(e) =>
                                                    handleSelectedDateChange(stage?.systemName, "startDate", e.target.value)
                                                }
                                            />
                                        }
                                    </TableCell>

                                    <TableCell>
                                        {isDealPhase ? (
                                            <input
                                                type="date"
                                                value={formData["Phase End Date"] || deals.details["Phase End Date"]}
                                                min={deals.details["Deal Start Date"]}
                                                max={deals.details["Deal End Date"]}
                                                onChange={(e) =>
                                                    handleDateChange("Phase End Date", e.target.value)
                                                }
                                            />
                                        ) :
                                            <input
                                                type="date"
                                                value={selectedStage?.[stage?.systemName]?.endDate || deals.details["Deal End Date"]}
                                                min={deals.details["Deal Start Date"]}
                                                max={deals.details["Deal End Date"]}
                                                onChange={(e) =>
                                                    handleSelectedDateChange(stage?.systemName, "endDate", e.target.value)
                                                }
                                            />}
                                    </TableCell>

                                    <TableCell>0 %</TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>

                <div className="grid grid-cols-2 gap-6">
                    {customfeilds?.map((field: CustomField, index: any) => {
                        if (
                            field.subCategory === "Phase Information" &&
                            field.active === true
                        ) {
                            switch (field.type) {
                                case "text":
                                case "number":
                                case "date":
                                    // Exclude fields with label "Phase Start Date" or "Phase End Date"
                                    if (
                                        field.label !== "Phase Start Date" &&
                                        field.label !== "Phase End Date"
                                    ) {
                                        return (
                                            <div key={index}>
                                                <label
                                                    htmlFor={field.name}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {field.label}{" "}
                                                    {field.requiredfield && (
                                                        <span style={{ color: "red" }}>*</span>
                                                    )}
                                                </label>
                                                <input
                                                    type={field.type}
                                                    id={field.name}
                                                    name={field.name}
                                                    placeholder={field.placeholder}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required={field.requiredfield}
                                                />
                                            </div>
                                        );
                                    }
                                    break;
                                case "select":
                                    // Exclude fields with label "Deal Phase"
                                    if (field.label !== "Deal Phase") {
                                        return (
                                            <div key={index}>
                                                <label
                                                    htmlFor={field.name}
                                                    className="block text-sm font-medium text-gray-700"
                                                >
                                                    {field.label}{" "}
                                                    {field.requiredfield && (
                                                        <span style={{ color: "red" }}>*</span>
                                                    )}
                                                </label>
                                                <select
                                                    id={field.name}
                                                    name={field.name}
                                                    value={formData[field.name]}
                                                    onChange={handleChange}
                                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required={field.requiredfield}
                                                >
                                                    <option value="">{field.placeholder}</option>
                                                    {field.options?.map((option, optionIndex) => (
                                                        <option
                                                            key={`${index}-${optionIndex}-optdynamic`}
                                                            value={option}
                                                        >
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        );
                                    }
                                    break;
                                case "User Select":
                                    return (
                                        <div className="">
                                            <label
                                                htmlFor={field?.name}
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                {field.label}{" "}
                                                {field.requiredfield && (
                                                    <span style={{ color: "red" }}>*</span>
                                                )}
                                            </label>
                                            <Select
                                                options={users.map((user: any) => {
                                                    return { value: user.name, label: user.name };
                                                })}
                                                value={{ value: dealOwner, label: dealOwner }}
                                                onChange={(value: any) => {
                                                    // console.log(value.value)
                                                    setDealOwner(value.value);
                                                }}
                                                isSearchable={true}
                                                components={{ Option: ImageOption }}
                                                placeholder="Select an option..."
                                            />
                                        </div>
                                    );
                                    break;
                                default:
                                    return null;
                            }
                        }
                        return null;
                    })}
                </div>

                <h5 className="text-xl font-bold mb-4">Select Playbook</h5>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="template"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Template <span style={{ color: "red" }}>*</span>
                        </label>
                        <select
                            id="template"
                            name="template"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                            disabled
                        >
                            <option value="Select template">Select template</option>
                            <option value="template 1">template 1</option>
                            <option value="template 2">template 2</option>
                            <option value="template 3">template 3</option>
                        </select>
                    </div>
                </div>

                <h5 className="text-xl font-bold mb-4">Data and Resources</h5>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="template"
                            className="block text-sm font-medium text-gray-700"
                        >
                            <b> Attach file</b>
                        </label>

                        <div className="flex w-full">
                            <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center p-0 h-24 w-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                            >
                                <div className="flex flex-col items-center justify-center pt-4 pb-5">
                                    <svg
                                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 20 16"
                                    >
                                        <path
                                            stroke="currentColor"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                        />
                                    </svg>
                                    <p className=" text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-semibold">VDR</span>
                                        &nbsp; drag and drop
                                    </p>
                                </div>
                                <input id="dropzone-file" type="file" className="hidden" />
                            </label>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-center w-full"></div>
                    </div>
                </div>

                <div className="flex items-center justify-end">
                    <a className="cursor-pointer bg-gray-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Cancel
                    </a>
                    &nbsp;&nbsp;
                    <button
                        type="submit"
                        className=" bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};




