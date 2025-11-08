import { redirect } from "next/navigation";

// TEMPORARY: Auth disabled - direct redirect to dashboard
export default async function Home() {
  redirect("/dashboard");
}

// import { getServerSession } from "next-auth";
// import authOptions from "@/lib/auth/options";
// import { UserRole } from "@prisma/client";
// 
// export default async function Home() {
//   const session = await getServerSession(authOptions);
// 
//   if (!session?.user) {
//     redirect("/login");
//   }
// 
//   if (session.user.role === UserRole.ADMIN) {
//     redirect("/dashboard");
//   }
// 
//   if (session.user.role === UserRole.CLIENT) {
//     redirect("/portal");
//   }
// 
//   redirect("/login");
// }
