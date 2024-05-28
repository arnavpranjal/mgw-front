import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialProvider from "next-auth/providers/credentials";
import { Backend_URL } from "./Constants";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      image: string;
      id: number;
      email: string;
      name: string;
    };

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number;
      email: string;
      name: string;
      image: string;
    };

    backendTokens: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  }
}

async function refreshToken(token: JWT): Promise<JWT> {
  const res = await fetch(Backend_URL + "/auth/refresh", {
    method: "POST",
    headers: {
      authorization: `Refresh ${token.backendTokens.refreshToken}`,
    },
  });
  console.log("refreshed");

  const response = await res.json();

  return {
    ...token,
    backendTokens: response,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID ?? "",
      clientSecret: process.env.GOOGLE_SECRET ?? "",
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    CredentialProvider({
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "jsmith@examle.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) return null;
        const { username, password } = credentials;
        const res = await fetch(Backend_URL + "/auth/login", {
          method: "POST",
          body: JSON.stringify({
            username,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (res.status == 401) {
          console.log(res.statusText);

          return null;
        }
        const user = await res.json();
        console.log(user);

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/", //sigin page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      if (new Date().getTime() > token?.backendTokens?.expiresIn) {
        return await refreshToken(token);
      } else if (token?.backendTokens ?? token) {
        return token;
      } else {
        return token;
      }
    },

    async session({ token, session }) {
      session.user = token?.user ?? token;

      session.backendTokens = token.backendTokens;
      return session;
    },
  },
};

// async authorize(credentials, req) {
//   const user = { id: "1", name: "John", email: credentials?.email };
//   if (user) {
//     // Any object returned will be saved in `user` property of the JWT
//     return user;
//   } else {
//     // If you return null then an error will be displayed advising the user to check their details.
//     return null;

//     // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
//   }
// },
