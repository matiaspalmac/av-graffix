import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { roles, users } from "@/db/schema";
import { trackLoginSession } from "@/app/erp/login/actions";

const ALLOWED_ERP_ROLES = new Set(["admin", "finanzas"]);

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/erp/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString() ?? "";

        if (!email || !password) {
          return null;
        }

        const result = await db
          .select({
            id: users.id,
            fullName: users.fullName,
            email: users.email,
            passwordHash: users.passwordHash,
            isActive: users.isActive,
            roleCode: roles.code,
          })
          .from(users)
          .leftJoin(roles, eq(users.roleId, roles.id))
          .where(eq(users.email, email))
          .limit(1);

        const account = result[0];

        if (!account || !account.isActive) {
          return null;
        }

        if (!account.roleCode || !ALLOWED_ERP_ROLES.has(account.roleCode)) {
          return null;
        }

        const isValidPassword = await compare(password, account.passwordHash);
        if (!isValidPassword) {
          return null;
        }

        await db
          .update(users)
          .set({ lastLoginAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
          .where(eq(users.id, account.id));

        // Registrar sesión de login con tracking
        await trackLoginSession(account.id);

        return {
          id: String(account.id),
          email: account.email,
          name: account.fullName,
          role: account.roleCode ?? "finanzas",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.userId ?? "");
        session.user.role = String(token.role ?? "finanzas");
      }
      return session;
    },
  },
});
