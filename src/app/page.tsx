
"use client";

import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection } from '@/firebase';
import { MenuItem, Announcement } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Megaphone } from 'lucide-react';

export default function Home() {
  const { data: menuItems, loading: menuLoading } = useCollection<MenuItem>('menuItems');
  const { data: announcements, loading: announcementsLoading } = useCollection<Announcement>('announcements');

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[0];
  };

  const loading = menuLoading || announcementsLoading;
  
  // Show only daily items (not pre-order) that are in stock
  const dailyMenuItems = menuItems.filter(item => !item.isPreOrderOnly && item.availability === 'In Stock');

  const latestAnnouncement = announcements.sort((a,b) => b.createdAt - a.createdAt)[0];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      
      {latestAnnouncement && (
        <div className="mb-12 bg-muted/50 border border-border p-6 rounded-xl shadow-sm">
            <div className="flex items-start gap-4">
                <Megaphone className="h-6 w-6 text-primary mt-1" />
                <div className="flex-1">
                    <h3 className="text-xl font-headline font-semibold text-foreground">{latestAnnouncement.title}</h3>
                    <p className="text-muted-foreground mt-2 whitespace-pre-wrap">{latestAnnouncement.content}</p>
                </div>
            </div>
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline text-primary mb-2">
          Daily Menu
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our delicious drinks and snacks, available for purchase today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading && Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="flex flex-col overflow-hidden">
                <CardHeader className="p-0">
                    <Skeleton className="w-full h-48" />
                </CardHeader>
                <CardContent className="flex-grow p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                </CardContent>
                <CardFooter className="p-6 pt-0">
                    <Skeleton className="h-6 w-1/4" />
                </CardFooter>
            </Card>
        ))}
        {dailyMenuItems.map((item) => {
          const image = getImage(item.imageId);
          return (
            <Card key={item.id} className="flex flex-col overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 ease-in-out shadow-lg hover:shadow-xl">
              <CardHeader className="p-0">
                <div className="relative w-full h-48">
                  <Image
                    src={image.imageUrl}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                  />
                  {item.availability === 'Sold Out' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">Sold Out</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="font-headline text-xl">{item.name}</CardTitle>
                  <Badge variant={item.availability === 'In Stock' ? 'secondary' : 'destructive'} className="shrink-0">
                    {item.availability}
                  </Badge>
                </div>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <p className="text-lg font-bold text-primary">
                  Rs{item.price.toFixed(0)}
                </p>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
