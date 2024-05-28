import React, { ChangeEvent, useState, useRef } from "react";
// import { dyform } from "../../constants/data";
// import Select, { components } from "react-select";
import Select , {components } from "react-select";
import { useQuery } from "react-query";
import { Backend_URL } from "@/lib/Constants";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import useLocalization from "../../localization/localizationhookStages";

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

export async function fetchDisplayStages() {
  const response = await fetch(Backend_URL + `/stages`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchCustomFeilds() {
  const response = await fetch(Backend_URL + "/customfeilds?category=deal");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

export async function fetchUsersData() {
  const response = await fetch(Backend_URL + "/user/all");
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
  const { data: session } = useSession();
  const { l } = useLocalization();

  const {
    data: customfeilds,
    error,
    isLoading,
    refetch,
  } = useQuery("dynamic-fields", fetchCustomFeilds);

  const { data: users, isLoading: userLoading } = useQuery(
    "users",
    fetchUsersData
  );

  const { data: stages } = useQuery("roles", fetchDisplayStages);

  type formData = {
    [key: string]: any;
    active: boolean;
    name: string;
    label: string;
    type: string;
    placeholder: string;
    options: string[];
    requiredfield: boolean;
    subCategory: string;
  };

  const [formData, setFormData] = useState({});
  const [dealOwner, setDealOwner] = useState(session?.user.name);

  const formRef = useRef<HTMLFormElement>(null);

  const handleReset = () => {
    formRef.current?.reset(); // Use optional chaining to call reset only if formRef.current is not null
    setFormData({});
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // console.log(formData);
    onData({ ...formData, "deal owner": dealOwner });
    // handleReset();
  };

  const [imageSrc, setImageSrc] = useState<string>("");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageSrc(reader.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) return "Loading...";
  if (error) return "An error has occurred: " + error;

  if (userLoading) return "Loading...";
  if (error) return "An error has occurred: " + error;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
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
                      <Select
                        options={users.map((user: any) => {
                          return { value: user.name, label: user.name };
                        })}
                        onChange={(value: any) => {
                          setDealOwner(value.value);
                        }}
                        isSearchable={true}
                        components={{ Option: ImageOption }}
                        placeholder="Select an option..."
                      />
                    </div>
                  );

                // Add more cases for other types

                default:
                  return null;
              }
            }
          }
        })}
      </div>
      <h5 className="text-xl font-bold mb-4">Phase Information</h5>
      <div className="grid grid-cols-6 gap-6">
        {customfeilds?.map((field: CustomField, index: any) => {
          if (field.subCategory == "Phase Information") {
            if (field?.active == true) {
              switch (field.type) {
                case "text":
                case "number":
                case "date":
                  return (
                    <div className="col-start-1 col-end-4">
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
                    <div className="col-start-1 col-end-4">
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
                        {field.name == "Deal Phase"
                          ? stages?.map((roles: any) => (
                              <option
                                key={`${index}-optdynamic`}
                                value={roles.displayName}
                              >
                                {roles.displayName}
                              </option>
                            ))
                          : field.options?.map((option, index) => (
                              <option
                                key={`${index}-optdynamic`}
                                value={option}
                              >
                                {option}
                              </option>
                            ))}
                      </select>
                    </div>
                  );
                case "dynamic":
                  return (
                    <div className="col-start-1 col-end-4">
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
                        onChange={(value: any) => {
                          setDealOwner(value.value);
                        }}
                        isSearchable={true}
                        components={{ Option: ImageOption }}
                        placeholder="Select an option..."
                      />
                    </div>
                  );

                // Add more cases for other types

                default:
                  return null;
              }
            }
          }
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
          <div className="flex items-center justify-center w-full">
            {/* <div className="container mx-auto p-4">
              <label
                htmlFor="file_input"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                <b> Add Logo</b>
              </label>
              <input
                id="file_input"
                type="file"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 border rounded-lg cursor-pointer dark:text-gray-400 focus:outline-none dark:border-gray-600 dark:bg-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt="Preview"
                  className="mt-4 w-auto max-h-64 rounded-lg"
                />
              )}
            </div> */}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <a
          onClick={() => setFormOpen(false)}
          className="cursor-pointer bg-gray-500 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
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
