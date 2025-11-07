import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { UserRole } from "../generated/prisma/client";
import { authOptions } from "./options";

/**
 * Extended session type with user role
 */
export type AuthSession = {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
};

/**
 * Get the authenticated user session from API routes
 * @returns Session with user info or null if not authenticated
 */
export async function getAuthSession(): Promise<AuthSession | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return session as AuthSession;
}

/**
 * Middleware to require authentication for API routes
 * Returns 401 if user is not authenticated
 */
export function requireAuth(
  handler: (req: NextRequest, session: AuthSession, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    return handler(req, session, context);
  };
}

/**
 * Middleware to require admin role for API routes
 * Returns 401 if not authenticated, 403 if not admin
 */
export function requireAdmin(
  handler: (req: NextRequest, session: AuthSession, context?: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context?: any) => {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please log in." },
        { status: 401 }
      );
    }

    if (session.user.role !== UserRole.ADMIN) {
      return NextResponse.json(
        { success: false, error: "Forbidden. Admin access required." },
        { status: 403 }
      );
    }

    return handler(req, session, context);
  };
}

/**
 * Middleware to require specific role(s) for API routes
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (handler: (req: NextRequest, session: AuthSession, context?: any) => Promise<NextResponse>) => {
    return async (req: NextRequest, context?: any) => {
      const session = await getAuthSession();

      if (!session) {
        return NextResponse.json(
          { success: false, error: "Unauthorized. Please log in." },
          { status: 401 }
        );
      }

      if (!allowedRoles.includes(session.user.role)) {
        return NextResponse.json(
          { success: false, error: "Forbidden. Insufficient permissions." },
          { status: 403 }
        );
      }

      return handler(req, session, context);
    };
  };
}

/**
 * Check if a user has a specific role
 */
export function hasRole(session: AuthSession | null, role: UserRole): boolean {
  return session?.user?.role === role;
}

/**
 * Check if a user is an admin
 */
export function isAdmin(session: AuthSession | null): boolean {
  return hasRole(session, UserRole.ADMIN);
}
