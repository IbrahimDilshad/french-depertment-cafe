
"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { useCollection, useDatabase } from "@/firebase";
import { Announcement } from "@/lib/types";
import { ref, push, set, serverTimestamp, remove } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...
                </>
            ) : (
                <>
                    <PlusCircle className="mr-2 h-4 w-4" /> Publish Announcement
                </>
            )}
        </Button>
    )
}


export default function AnnouncementsPage() {
    const { toast } = useToast();
    const db = useDatabase();
    const { data: announcements, loading } = useCollection<Announcement>("announcements");

    const handlePublish = async (formData: FormData) => {
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;

        if (!title || !content) {
            toast({ variant: "destructive", title: "Error", description: "Title and content are required." });
            return;
        }

        if (!db) {
            toast({ variant: "destructive", title: "Error", description: "Database not connected." });
            return;
        }

        try {
            const announcementsRef = ref(db, "announcements");
            const newAnnouncementRef = push(announcementsRef);
            await set(newAnnouncementRef, {
                title,
                content,
                createdAt: serverTimestamp()
            });
            toast({ title: "Success", description: "Announcement has been published." });
            // Ideally reset form, but tricky with server actions.
        } catch (e: any) {
            toast({ variant: "destructive", title: "Error", description: e.message });
        }
    };
    
    const handleDelete = async (announcementId: string) => {
        if (!db) return;
        const announcementRef = ref(db, `announcements/${announcementId}`);
        try {
            await remove(announcementRef);
            toast({ title: "Success", description: "Announcement deleted." });
        } catch(e: any) {
            toast({ variant: "destructive", title: "Error", description: e.message });
        }
    }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-headline">Manage Announcements</h1>
        <p className="text-muted-foreground mt-2">Create and manage announcements for the main page.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
            <form action={handlePublish}>
                <CardHeader>
                    <CardTitle>New Announcement</CardTitle>
                    <CardDescription>This will be displayed publicly on the website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="title">Title</Label>
                        <Input name="title" id="title" placeholder="e.g., Cafe Closed for Holidays" required />
                    </div>
                     <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="content">Content</Label>
                        <Textarea name="content" id="content" placeholder="Full details about the announcement..." required />
                    </div>
                </CardContent>
                <CardFooter>
                    <SubmitButton />
                </CardFooter>
            </form>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Published Announcements</CardTitle>
                <CardDescription>The most recent announcements are shown first.</CardDescription>
            </CardHeader>
            <CardContent>
                {loading && <p>Loading...</p>}
                <div className="space-y-4">
                    {announcements.sort((a,b) => b.createdAt - a.createdAt).map(announcement => (
                        <div key={announcement.id} className="border p-4 rounded-md relative">
                           <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-2 right-2 h-7 w-7 text-destructive hover:text-destructive/90"
                                onClick={() => handleDelete(announcement.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <h4 className="font-semibold">{announcement.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{announcement.content}</p>
                            <p className="text-xs text-muted-foreground/80 mt-2">
                                {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    ))}
                    {!loading && announcements.length === 0 && <p className="text-sm text-muted-foreground text-center">No announcements yet.</p>}
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
