"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Apple, Chrome, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password must be at least 8 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginValues) => {
    startTransition(async () => {
      setServerError(null);
      const response = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl,
      });

      if (!response || response.error) {
        setServerError(response?.error ?? "Invalid email or password.");
        return;
      }

      router.replace(response.url ?? callbackUrl);
      router.refresh();
    });
  };

  return (
    <Card className="w-full rounded-3xl border border-zinc-800 bg-zinc-900/90 p-8 shadow-xl backdrop-blur">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-semibold text-white">Welcome back</CardTitle>
        <p className="text-sm text-zinc-400">Login with your Apple or Google account</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-start gap-3 rounded-xl border-zinc-700 bg-transparent text-sm font-medium text-zinc-100 hover:bg-zinc-800/70"
          >
            <Apple className="size-5" />
            Login with Apple
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-11 w-full justify-start gap-3 rounded-xl border-zinc-700 bg-transparent text-sm font-medium text-zinc-100 hover:bg-zinc-800/70"
          >
            <Chrome className="size-5" />
            Login with Google
          </Button>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-500">
          <div className="h-px flex-1 bg-zinc-800" />
          Or continue with
          <div className="h-px flex-1 bg-zinc-800" />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2 text-left">
                  <FormLabel className="text-sm text-zinc-200">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      disabled={isPending}
                      className="h-11 rounded-xl border-zinc-700 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2 text-left">
                  <div className="flex items-center justify-between text-sm">
                    <FormLabel className="text-zinc-200">Password</FormLabel>
                    <Link href="/forgot-password" className="text-zinc-400 hover:text-zinc-200">
                      Forgot your password?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={isPending}
                      className="h-11 rounded-xl border-zinc-700 bg-zinc-950/60 text-zinc-100 placeholder:text-zinc-500 focus:border-zinc-500 focus:ring-zinc-500"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {serverError ? (
              <p className="text-sm font-medium text-red-400">{serverError}</p>
            ) : null}

            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-white text-base font-semibold text-black hover:bg-zinc-200"
              disabled={isPending}
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-zinc-200 underline underline-offset-4">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
