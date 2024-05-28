"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Backend_URL } from "@/lib/Constants";

const fetchDisplayNames = async (
  setDisplayNames: (value: Record<string, string>) => void
) => {
  try {
    const response = await axios.get(Backend_URL+`/roles`);

    const displayNames: Record<string, string> = {};
    response.data.forEach(
      (role: { systemName: string; displayName: string }) => {
        displayNames[role.systemName] = role.displayName;
      }
    );
    setDisplayNames(displayNames);
    return;
  } catch (error) {
    console.log("error fetching data :");
  }
};

const useLocalization = () => {
  const [displayNames, setDisplayNames] = useState<Record<string, string>>({});
  useEffect(() => {
    fetchDisplayNames(setDisplayNames);
  }, []);
  const l = useCallback(
    (inputString: string) => {
      const displayName = displayNames[inputString] || "";

      return displayName;
    },
    [displayNames]
  );

  return { l };
};

export default useLocalization;