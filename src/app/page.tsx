
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
import { Badge } from '@/components/ui/badge';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useCollection } from '@/firebase';
import { MenuItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const { data: menuItems, loading } = useCollection<MenuItem>('menuItems');

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[0];
  };

  const dailyMenuItems = menuItems.filter(item => !item.isPreOrderOnly);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline text-primary mb-2">
          Our Menu
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover our delicious drinks and snacks, prepared with love by our volunteers.
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
