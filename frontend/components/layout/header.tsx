"use client";
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import Image from "next/image";
import Link from "next/link";
import { Backend_URL } from "@/lib/Constants";
import React from "react";
import axios from "axios";

export default function Header() {
  const [logoImage, setLogoImage] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const fetchLogo = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(Backend_URL + "/logo");

      setLogoImage(response.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching logo:", error);
    }
  };

  React.useEffect(() => {
    fetchLogo();
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 supports-backdrop-blur:bg-background/60 border-b bg-background/95 backdrop-blur z-20">
      <nav className="h-14 flex items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href={"#"} target="_blank">
            {/* <img
              // src="/LogoMergerware.svg"
              src={"https://logobucketnestjs.s3.ap-south-1.amazonaws.com/65166127ca18241731aa3144_3.webp"}
              alt={""}
              // width={155}
              // height={155}
            /> */}
            {logoImage && logoImage != "" ? (
              <img
                src={logoImage}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/LogoMergerware.svg';
                }}
                alt="Logo"
                style={{ width: "150px", height: "50px", objectFit: "fill" }}
              />
            ) : (
              <img
                src="/LogoMergerware.svg"
                alt="Logo"
                style={{ width: "150px", height: "60px", objectFit: "fill" }}
              />
            )}
            {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg> */}
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
