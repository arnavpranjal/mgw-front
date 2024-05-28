import React, { useState } from "react";
import { dyform } from "../../constants/data";
import { useQuery } from "react-query";
import Select from "react-select";

import { Backend_URL } from "@/lib/Constants";
import "./fix.css";

interface CustomField {
  requiredfield: boolean;
  active?: boolean;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  options?: string[];
}

export async function fetchDisplayRoles() {
  const response = await fetch(Backend_URL + `/roles`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchCustomFeilds() {
  const response = await fetch(Backend_URL + "/customfeilds?category=user");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

interface DynamicFormProps {
  onData: (data: object) => void;
  setFormOpen: (data: boolean) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ onData, setFormOpen }) => {
  const {
    data: customfeilds,
    error,
    isLoading,
    refetch,
  } = useQuery("dynamic-fields", fetchCustomFeilds);

  const { data: roles } = useQuery("roles", fetchDisplayRoles);

  type formData = {
    [key: string]: any;
    active: boolean;
    name: string;
    label: string;
    type: string;
    placeholder: string;
    options: never[];
    requiredfield: boolean;
  };

  const [formData, setFormData] = useState({});

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // console.log(formData);

    onData(formData);
  };
  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error;

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{ maxHeight: "660px", overflowY: "auto" }}
        className="space-y-5 px-6"
      >
        {customfeilds?.map((field: CustomField, index: any) => {
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
                      type={field.type} // This will dynamically set to 'text', 'number', or 'date'
                      id={field.name}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[field.name as keyof typeof formData]}
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
                      value={formData[field.name as keyof typeof formData]}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required={field.requiredfield}
                    >
                      <option value="">{field.placeholder}</option>
                      {field.name == "Role"
                        ? roles?.map((roles: any) => (
                            <option
                              key={`${index}-optdynamic`}
                              value={roles.displayName}
                            >
                              {roles.displayName}
                            </option>
                          ))
                        : field.options?.map((option, index) => (
                            <option key={`${index}-optdynamic`} value={option}>
                              {option}
                            </option>
                          ))}
                    </select>
                  </div>
                );

              case "dynamic":
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
                    {/* <Select
                    options={['abc','dfg','xyz','efg']}
                    onChange={()=>{}}
                    isSearchable={true}
                    placeholder="Select an option..."
                  /> */}
                    {/* <p>zdbvzd</p> */}
                  </div>
                );

              // Add more cases for other types

              default:
                return null;
            }
          }
        })}
      </div>
      <div className="flex items-center justify-between px-6 mt-6">
        <a
          onClick={() => setFormOpen(false)}
          className="cursor-pointer bg-gray-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cancel
        </a>
        <button
          type="submit"
          className=" bg-primary hover:bg-primary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </div>
      {/* <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        Submit
      </button> */}
    </form>
  );
};

export default DynamicForm;

// return (
//   <div key={index+"a"}>
//     <label
//       htmlFor={field?.name}
//       className="block text-sm font-medium text-gray-700"
//     >
//       {field.label}:
//     </label>

//     {field.type != "select" ? (
//       <input
//         type={field.type}
//         id={field.name}
//         name={field.name}
//         placeholder={field.placeholder}
//         value={formData[field.name as keyof typeof formData]}
//         onChange={handleChange}
//         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//       />
//     ) : (
//       <select
//         id={field.name}
//         name={field.name}
//         value={formData[field.name as keyof typeof formData]}
//         onChange={handleChange}
//         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//       >
//         <option value="">{field.placeholder}</option>
//         {field?.options?.map((options, index) => (
//           <option key={index+"optdyanmic"} value={options}>{options}</option>
//         ))}
//       </select>
//     )}

//   </div>
// );
