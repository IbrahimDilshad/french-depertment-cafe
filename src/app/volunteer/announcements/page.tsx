
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

// This is a placeholder for where real announcements would be fetched.
// For now, we'll use a static array.
const teamAnnouncements = [
    {
        id: 1,
        title: "Stock Take this Friday",
        content: "Just a reminder that we have a full stock take scheduled for this Friday after closing. Please ensure all areas are tidy and accessible. Your cooperation is appreciated!",
        date: "3 days ago"
    },
    {
        id: 2,
        title: "New Seasonal Drinks Menu Launch",
        content: "The new seasonal menu is launching next Monday! Please familiarize yourselves with the new recipes. Tasting session at 9 AM on Monday morning.",
        date: "1 week ago"
    },
    {
        id: 3,
        title: "Welcome to our new volunteers!",
        content: "A big welcome to our new volunteers, Ali and Sara! Please make them feel welcome and help them get up to speed.",
        date: "2 weeks ago"
    }
]

export default function VolunteerAnnouncementsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline">Team Announcements</h1>
        <p className="text-muted-foreground mt-1">Important updates and information for all café staff and volunteers.</p>
      </div>

      <div className="space-y-6">
        {teamAnnouncements.map(announcement => (
            <Card key={announcement.id}>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-xl">{announcement.title}</CardTitle>
                            <CardDescription className="mt-1">Posted {announcement.date}</CardDescription>
                        </div>
                        <Megaphone className="h-6 w-6 text-muted-foreground" />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-foreground/80">{announcement.content}</p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
