import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import authOptions from "@/lib/auth/options";
import { UserRole } from "@prisma/client";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role === UserRole.ADMIN) {
    redirect("/dashboard");
  }

  if (session.user.role === UserRole.CLIENT) {
    redirect("/portal");
  }

  redirect("/login");
}
