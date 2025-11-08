import { redirect } from "next/navigation";

// TEMPORARY: Auth disabled - redirect to dashboard
export default async function LoginPage() {
  redirect("/dashboard");
}

// import Link from "next/link";
// import { getServerSession } from "next-auth";
// import { GalleryVerticalEnd } from "lucide-react";
// import { LoginForm } from "./login-form";
// import authOptions from "@/lib/auth/options";
// import { UserRole } from "@prisma/client";
// 
// export default async function LoginPage() {
//   const session = await getServerSession(authOptions);
// 
//   if (session?.user) {
//     if (session.user.role === UserRole.ADMIN) {
//       redirect("/dashboard");
//     }
// 
//     if (session.user.role === UserRole.CLIENT) {
//       redirect("/portal");
//     }
// 
//     redirect("/");
//   }
//
//   return (
//     <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
//       <div className="flex w-full max-w-sm flex-col gap-6">
//         <Link href="/" className="flex items-center gap-2 self-center font-medium">
//           <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
//             <GalleryVerticalEnd className="size-4" />
//           </div>
//           WaveLaunch OS
//         </Link>
//         <LoginForm />
//       </div>
//     </div>
//   );
// }
