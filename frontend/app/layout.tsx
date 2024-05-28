// import Providers from "@/components/layout/providers";
import Providers from "@/components/layout/Providers";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mergerware",
  description: "Mergerware",
};

interface Props {
  children: React.ReactNode;
}

export default async function RootLayout(props: Props) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} overflow-hidden`}>
        <Providers>
          <Toaster />
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
