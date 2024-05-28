import { Backend_URL } from "@/lib/Constants";
import { authOptions } from "@/lib/auth-options";
import NextAuth from "next-auth/next";
import { JWT } from "next-auth/jwt";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
