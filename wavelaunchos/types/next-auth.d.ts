import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import type { AdapterUser as DefaultAdapterUser } from "next-auth/adapters";

import type { UserRole } from "@/lib/generated/prisma/enums";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser extends DefaultAdapterUser {
    role: UserRole;
  }
}
