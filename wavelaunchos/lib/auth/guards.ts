import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import type { Session } from "next-auth";
import { UserRole } from "@prisma/client";

import authOptions from "./options";

type RequireSessionOptions = {
  callbackUrl?: string;
};

type RoleValue = (typeof UserRole)[keyof typeof UserRole];

async function getSession(): Promise<Session | null> {
  return getServerSession(authOptions);
}

export async function requireSession({ callbackUrl }: RequireSessionOptions = {}) {
  const session = await getSession();

  if (!session?.user) {
    const target = callbackUrl ?? "/dashboard";
    redirect(`/login?callbackUrl=${encodeURIComponent(target)}`);
  }

  return session;
}

export async function requireRole(
  role: RoleValue | RoleValue[],
  { callbackUrl }: RequireSessionOptions = {}
) {
  const session = await requireSession({ callbackUrl });
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!allowedRoles.includes(session.user.role as RoleValue)) {
    if (session.user.role === UserRole.CLIENT) {
      redirect("/portal");
    }

    redirect("/dashboard");
  }

  return session;
}

export async function requireAdmin(options?: RequireSessionOptions) {
  return requireRole(UserRole.ADMIN, options);
}

export async function requireClient(options?: RequireSessionOptions) {
  return requireRole(UserRole.CLIENT, options);
}

export async function getOptionalSession() {
  return getSession();
}

