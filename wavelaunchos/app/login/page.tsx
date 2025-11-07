import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { LoginForm } from "./login-form";
import authOptions from "@/lib/auth/options";
import { UserRole } from "@/lib/generated/prisma/enums";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);

  if (session?.user) {
    if (session.user.role === UserRole.ADMIN) {
      redirect("/dashboard");
    }

    if (session.user.role === UserRole.CLIENT) {
      redirect("/portal");
    }

    redirect("/");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
