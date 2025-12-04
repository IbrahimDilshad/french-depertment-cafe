
"use client";

import { useFormState, useFormStatus } from "react-dom";
import { generateAnnouncement } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
                    <Wand2 className="mr-2 h-4 w-4" /> Generate
                </>
            )}
        </Button>
    )
}


export default function AnnouncementsPage() {
    const [state, formAction] = useFormState(generateAnnouncement, {
        announcement: `Dear students and staff,\n\nWe are excited to announce an update at our café regarding **our new seasonal menu**. Come and see what's new!\n\nThank you,\nThe Café Team`,
        audience: 'website'
    });
    const [teamAnnouncement, setTeamAnnouncement] = useState('Team Update:\n\nPlease be aware of the following: a reminder about the upcoming stock take this Friday. Let\'s work together to ensure a smooth service.');
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if(state?.announcement) {
            if(state.audience === 'team') {
                setTeamAnnouncement(state.announcement);
            }
            formRef.current?.reset();
        }
    }, [state]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center">
        <h1 className="text-3xl font-headline">AI Announcement Assistant</h1>
        <p className="text-muted-foreground mt-2">Generate announcements for the website or your internal team.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <Card>
            <form action={formAction} ref={formRef}>
                <CardHeader>
                    <CardTitle>Create Announcement</CardTitle>
                    <CardDescription>Enter a topic, choose an audience, and the AI will do the rest.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="topic">Topic</Label>
                        <Textarea name="topic" id="topic" placeholder="e.g., New holiday pastries, special offer on coffee" required />
                    </div>
                     <div className="grid w-full items-center gap-1.5">
                        <Label>Audience</Label>
                        <RadioGroup defaultValue="website" name="audience" className="flex gap-4 mt-2">
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="website" id="r1" />
                                <Label htmlFor="r1">Website (Clients)</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="team" id="r2" />
                                <Label htmlFor="r2">Team</Label>
                            </div>
                        </RadioGroup>
                    </div>
                     {state?.error && <p className="text-sm font-medium text-destructive mt-2">{state.error}</p>}
                </CardContent>
                <CardFooter>
                    <GenerateButton />
                </CardFooter>
            </form>
        </Card>

        <div className="space-y-8">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Website Announcement</CardTitle>
                    <CardDescription>Review and copy the text for the public website.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    {state?.audience === 'website' && state.announcement ? (
                    <div className="bg-muted p-4 rounded-md h-full whitespace-pre-wrap font-body text-sm">
                        {state.announcement}
                    </div>
                    ) : (
                    <div className="bg-muted p-4 rounded-md h-full whitespace-pre-wrap font-body text-sm text-muted-foreground">
                        Your generated website announcement will appear here.
                    </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button variant="secondary" onClick={() => state?.audience === 'website' && state.announcement && navigator.clipboard.writeText(state.announcement)}>
                        Copy Text
                    </Button>
                </CardFooter>
            </Card>

            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle>Team Announcement</CardTitle>
                    <CardDescription>Review and copy the text for your internal team.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                    <div className="bg-muted p-4 rounded-md h-full whitespace-pre-wrap font-body text-sm">
                        {teamAnnouncement}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="secondary" onClick={() => navigator.clipboard.writeText(teamAnnouncement)}>
                        Copy Text
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
