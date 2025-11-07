"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Pin, PinOff, Trash2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { createNoteSchema } from "@/lib/validations/note";

const noteFormSchema = createNoteSchema.omit({ clientId: true });

type NoteFormValues = z.infer<typeof noteFormSchema>;

type NoteAuthor = {
  id: string;
  name: string | null;
  email: string;
};

type ClientNote = {
  id: string;
  content: string;
  createdAt: string;
  isImportant: boolean;
  author: NoteAuthor;
};

type ClientNotesPanelProps = {
  clientId: string;
};

function formatRelative(dateIso: string) {
  const date = new Date(dateIso);
  const diff = Date.now() - date.getTime();

  if (diff < 60_000) return "Just now";
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString();
}

export function ClientNotesPanel({ clientId }: ClientNotesPanelProps) {
  const { toast } = useToast();
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, startTransition] = useTransition();

  const form = useForm<NoteFormValues>({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      content: "",
      isImportant: false,
    },
  });

  const importantNotes = useMemo(() => notes.filter((note) => note.isImportant), [notes]);
  const otherNotes = useMemo(() => notes.filter((note) => !note.isImportant), [notes]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadNotes() {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/clients/${clientId}/notes`, {
          signal: controller.signal,
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Failed to fetch notes.");
        }

        setNotes(payload.data.data as ClientNote[]);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch client notes", error);
        toast({
          title: "Unable to load notes",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadNotes();

    return () => controller.abort();
  }, [clientId, toast]);

  const onSubmit = (values: NoteFormValues) => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/clients/${clientId}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || "Failed to create note.");
        }

        setNotes((prev) => [payload.data as ClientNote, ...prev]);
        form.reset({ content: "", isImportant: false });

        toast({
          title: "Note added",
          description: "Your note has been saved and shared with the team.",
        });
      } catch (error) {
        console.error("Failed to create note", error);
        toast({
          title: "Failed to create note",
          description: error instanceof Error ? error.message : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    });
  };

  const toggleImportance = async (note: ClientNote) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/notes/${note.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isImportant: !note.isImportant }),
      });
      const payload = await response.json();

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || "Failed to update note.");
      }

      setNotes((prev) => prev.map((item) => (item.id === note.id ? payload.data : item)));
    } catch (error) {
      console.error("Failed to toggle importance", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  const deleteNote = async (note: ClientNote) => {
    try {
      const response = await fetch(`/api/clients/${clientId}/notes/${note.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.error || "Failed to delete note.");
      }

      setNotes((prev) => prev.filter((item) => item.id !== note.id));
      toast({ title: "Note deleted" });
    } catch (error) {
      console.error("Failed to delete note", error);
      toast({
        title: "Deletion failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr),minmax(0,1fr)]">
      <Card className="border-border/50 bg-card/90 shadow-none">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base font-semibold text-foreground">Client Notes</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Capture meeting takeaways, next steps, and insights shared with the team.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border/60 bg-muted/10 p-6 text-center text-sm text-muted-foreground">
              No notes yet. Start a thread with the form on the right.
            </div>
          ) : (
            <div className="space-y-4">
              {importantNotes.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-amber-600">
                    <Pin className="h-3 w-3" /> Pinned notes
                  </div>
                  <div className="space-y-3">
                    {importantNotes.map((note) => (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onToggleImportance={toggleImportance}
                        onDelete={deleteNote}
                      />
                    ))}
                  </div>
                </div>
              ) : null}

              {importantNotes.length > 0 && otherNotes.length > 0 ? <Separator /> : null}

              {otherNotes.length > 0 ? (
                <div className="space-y-3">
                  {otherNotes.map((note) => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onToggleImportance={toggleImportance}
                      onDelete={deleteNote}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-card/90 shadow-none">
        <CardHeader className="space-y-2">
          <CardTitle className="text-base font-semibold text-foreground">Add a note</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Notes are visible to your internal team but hidden from clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="min-h-[140px] resize-none"
                        placeholder="Summarize decisions, blockers, or next steps..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isImportant"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-3 space-y-0 rounded-lg border border-border/60 bg-muted/10 p-3">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="text-sm font-medium">Pin this note</FormLabel>
                      <CardDescription className="text-xs">
                        Pinned notes stay at the top for quick reference.
                      </CardDescription>
                    </div>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isMutating}>
                {isMutating ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving note...
                  </span>
                ) : (
                  "Save note"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

type NoteCardProps = {
  note: ClientNote;
  onToggleImportance: (note: ClientNote) => void;
  onDelete: (note: ClientNote) => void;
};

function NoteCard({ note, onToggleImportance, onDelete }: NoteCardProps) {
  return (
    <div className="space-y-2 rounded-lg border border-border/60 bg-background/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">
              {note.author.name ?? note.author.email}
            </span>
            <span>•</span>
            <span>{formatRelative(note.createdAt)}</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground/90">{note.content}</p>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => onToggleImportance(note)}
            title={note.isImportant ? "Unpin note" : "Pin note"}
          >
            {note.isImportant ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => onDelete(note)}
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {note.isImportant ? (
        <Badge variant="secondary" className="bg-amber-200 text-amber-900">
          Pinned
        </Badge>
      ) : null}
    </div>
  );
}

