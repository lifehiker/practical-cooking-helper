import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { db } from "@/lib/db";
import { env, hasGoogleAuth, isAdminEmail } from "@/lib/env";

const providers: Provider[] = [
  Credentials({
    name: "Demo sign in",
    credentials: {
      email: { label: "Email", type: "email" },
      name: { label: "Name", type: "text" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.toString().trim().toLowerCase();
      const name = credentials?.name?.toString().trim();

      if (!email) {
        return null;
      }

      const user = await db.user.upsert({
        where: { email },
        update: {
          name: name || undefined,
          role: isAdminEmail(email) ? "admin" : undefined,
          lastLoginAt: new Date(),
        },
        create: {
          email,
          name: name || email.split("@")[0],
          role: isAdminEmail(email) ? "admin" : "user",
          lastLoginAt: new Date(),
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

if (hasGoogleAuth()) {
  providers.push(
    Google({
      clientId: env.googleClientId!,
      clientSecret: env.googleClientSecret!,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: env.authSecret,
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  providers,
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false;
      }

      await db.user.upsert({
        where: { email: user.email.toLowerCase() },
        update: {
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          role: isAdminEmail(user.email) ? "admin" : undefined,
          lastLoginAt: new Date(),
        },
        create: {
          email: user.email.toLowerCase(),
          name: user.name,
          image: user.image,
          role: isAdminEmail(user.email) ? "admin" : "user",
          lastLoginAt: new Date(),
        },
      });

      if (account?.provider === "google" || account?.provider === "credentials") {
        return true;
      }

      return false;
    },
    async jwt({ token }) {
      if (!token.email) {
        return token;
      }

      const user = await db.user.findUnique({
        where: { email: token.email.toLowerCase() },
        select: { id: true, role: true, plan: true, name: true, image: true },
      });

      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.plan = user.plan;
        token.name = user.name ?? token.name;
        token.picture = user.image ?? token.picture;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "user";
        session.user.plan = typeof token.plan === "string" ? token.plan : "FREE";
      }

      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
});
