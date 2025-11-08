import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "./login-form";
import authOptions from "@/lib/auth/options";
import { UserRole } from "@prisma/client";

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
    <div className="min-h-svh bg-[#0d0d0f] text-white">
      <div className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center px-6 py-12">
        <Link
          href="/"
          className="mb-8 flex items-center gap-3 text-sm font-medium text-zinc-200"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-white/10">
            <GalleryVerticalEnd className="size-5" />
          </span>
          WaveLaunch OS
        </Link>
        <LoginForm />
        <p className="mt-8 text-center text-xs text-zinc-400">
          By clicking continue, you agree to our {" "}
          <Link href="/terms" className="text-zinc-200 underline underline-offset-4">
            Terms of Service
          </Link>{" "}
          and {" "}
          <Link href="/privacy" className="text-zinc-200 underline underline-offset-4">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
