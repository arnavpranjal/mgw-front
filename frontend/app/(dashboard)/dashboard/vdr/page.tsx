"use client";

import Vdr from "./vdr";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import queryString from "query-string";

interface vdrState {
  isVdrOpen: boolean;
  path: string;
  entityName: string;
}
export default function Page() {
  // const [vdrstate, setVdrState] = React.useState<vdrState>({
  //   isVdrOpen: false,
  //   path: ``,
  //   entityName: "Task Name",
  // });

  // useEffect(() => {
  //   const storedData = sessionStorage.getItem("dealData") || "";
  //   const data = JSON.parse(storedData);
  //   setVdrState({ ...vdrstate, path: `${data?.dealname} > ${data?.phase}` });
  //   console.log(JSON.parse(storedData));
  // }, []);

  // path: "Deal name > phase name > Stream Group Name > Stream Name > Task group Name > Task Name ",
  if (typeof window !== "undefined") {
  const storedData = sessionStorage.getItem("dealData") || "";
  const data = JSON.parse(storedData);
  const path = `${data?.dealname} > ${data?.phase}`;

  return (
    <div className="h-full">
      <Vdr path={path} entityName={""} />
    </div>
  );
  }
}
