
"use client";

import { useActionState, useFormStatus } from "react-dom";
import { generateAnnouncement } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2 } from "lucide-react";
import { useEffect, useRef } from "react";

function GenerateButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
            ) : (
                <>
                    <Wand2 className="mr-2 h-4 w-4" /> Generate Announcement
                </>
            )}
        </Button>
    )
}


export default function AnnouncementsPage() {
    const [state, formAction] = useActionState(generateAnnouncement, null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if(state?.announcement) {
            formRef.current?.reset();
        }
    }, [state]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-headline">AI Announcement Assistant</h1>
        <p className="text-muted-foreground mt-2">Generate announcements for the website quickly and easily.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
            <form action={formAction} ref={formRef}>
                <CardHeader>
                    <CardTitle>Create Announcement</CardTitle>
                    <CardDescription>Enter a topic or a few keywords, and the AI will do the rest.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="topic">Topic</Label>
                        <Textarea name="topic" id="topic" placeholder="e.g., New holiday pastries, special offer on coffee" required />
                    </div>
                     {state?.error && <p className="text-sm font-medium text-destructive mt-2">{state.error}</p>}
                </CardContent>
                <CardFooter>
                    <GenerateButton />
                </CardFooter>
            </form>
        </Card>

        <Card className="flex flex-col">
             <CardHeader>
                <CardTitle>Generated Announcement</CardTitle>
                <CardDescription>Review and copy the generated text.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                {state?.announcement ? (
                <div className="bg-muted p-4 rounded-md h-full whitespace-pre-wrap font-body text-sm">
                    {state.announcement}
                </div>
                ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-center p-4">
                    Your generated announcement will appear here.
                </div>
                )}
            </CardContent>
             {state?.announcement && (
                <CardFooter>
                    <Button variant="secondary" onClick={() => navigator.clipboard.writeText(state.announcement!)}>
                        Copy Text
                    </Button>
                </CardFooter>
            )}
        </Card>
      </div>
    </div>
  );
}
