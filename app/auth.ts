import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import type { Provider } from "next-auth/providers";
import { z } from "zod";
import { upsertUser } from "./actions/user";

const providers: Provider[] = [GitHub]

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider()
      return { id: providerData.id, name: providerData.name }
    } else {
      return { id: provider.id, name: provider.name }
    }
  })
  .filter((provider) => provider.id !== "credentials")

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/error"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        await upsertUser(user.name!, user.email!, user.image!)
      }
      return token
    },
    session({ session, token }) {
      return session
    },
  },
  session: {
    maxAge: 7 * 24 * 60 * 60
  }
})

export const signupSchema = z.object({
  name: z.string().min(2).max(20, { message: "Name must contain at most 20 characters" }),
  nickname: z.string().max(20, { message: "Nickname must contain less than or 20 characters" }),
  email: z.string().email({ message: "Email invalid" }),
  password: z.string().min(8, { message: "Password must contain at least 8 characters" }).max(20, { message: "Password must contain less than or 20 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"] // Where to bind error
});