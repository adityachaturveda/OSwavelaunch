"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CLIENT_STATUS,
  CLIENT_STATUS_LABELS,
  type ClientStatusValue,
} from "@/lib/constants/client";
import { createClientSchema, type CreateClientInput } from "@/lib/validations/client";
import { useToast } from "@/hooks/use-toast";

type ClientFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode?: "create" | "edit";
  defaultValues?: Partial<CreateClientInput>;
  clientId?: string;
  onSuccess?: (client: unknown, mode: "create" | "edit") => void;
};

type ClientFormValues = z.input<typeof createClientSchema>;

export function ClientFormDialog({
  open,
  onOpenChange,
  mode = "create",
  defaultValues,
  clientId,
  onSuccess,
}: ClientFormDialogProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const fallbackValues: ClientFormValues = {
    creatorName: "",
    brandName: "",
    email: "",
    niche: "",
    goals: "",
    status: CLIENT_STATUS[0],
    socialHandles: {
      instagram: "",
      twitter: "",
      youtube: "",
      tiktok: "",
      linkedin: "",
      website: "",
    },
  };

  const mergedDefaults: ClientFormValues = {
    ...fallbackValues,
    ...defaultValues,
    status:
      ((defaultValues?.status as ClientStatusValue | undefined) ?? fallbackValues.status),
    socialHandles: {
      ...fallbackValues.socialHandles,
      ...(defaultValues?.socialHandles ?? {}),
    },
  };

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(createClientSchema),
    defaultValues: mergedDefaults,
  });

  const onSubmit = async (data: ClientFormValues) => {
    setIsSubmitting(true);

    try {
      const payload = createClientSchema.parse(data);
      const url = mode === "create" ? "/api/clients" : `/api/clients/${clientId}`;
      const method = mode === "create" ? "POST" : "PATCH";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to save client");
      }

      toast({
        title: mode === "create" ? "Client created" : "Client updated",
        description:
          mode === "create"
            ? `"${data.brandName}" is now in your client roster.`
            : `"${data.brandName}" has been updated.`,
      });

      form.reset();
      onOpenChange(false);
      onSuccess?.(result.data, mode);
      router.refresh();
    } catch (error) {
      console.error("Error saving client:", error);
      toast({
        title: "Failed to save client",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add New Client" : "Edit Client"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Enter the client details to create a new relationship."
              : "Update the client information below."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="creatorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Creator Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="brandName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Acme Studios" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="client@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CLIENT_STATUS.map((status) => (
                          <SelectItem key={status} value={status}>
                            {CLIENT_STATUS_LABELS[status as ClientStatusValue] ?? status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="niche"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niche</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tech, Fashion, Lifestyle" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormDescription>The industry or niche the creator operates in</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Goals</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the client's goals and objectives..."
                      className="min-h-[100px] resize-none"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>What are the client's main goals and objectives?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <h4 className="text-sm font-medium">Social Handles (Optional)</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="socialHandles.instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/..." {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialHandles.twitter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Twitter/X</FormLabel>
                      <FormControl>
                        <Input placeholder="https://twitter.com/..." {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialHandles.youtube"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">YouTube</FormLabel>
                      <FormControl>
                        <Input placeholder="https://youtube.com/..." {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialHandles.tiktok"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">TikTok</FormLabel>
                      <FormControl>
                        <Input placeholder="https://tiktok.com/..." {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialHandles.linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">LinkedIn</FormLabel>
                      <FormControl>
                        <Input placeholder="https://linkedin.com/..." {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="socialHandles.website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === "create" ? "Create Client" : "Update Client"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
