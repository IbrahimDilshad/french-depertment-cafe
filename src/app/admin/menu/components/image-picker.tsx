
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getMenuImages } from '@/lib/menu-images';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface ImagePickerProps {
    selectedImage?: string;
    onSelectImage: (imageName: string) => void;
}

export default function ImagePicker({ selectedImage, onSelectImage }: ImagePickerProps) {
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchImages() {
            setLoading(true);
            try {
                const imageList = await getMenuImages();
                setImages(imageList);
            } catch (error) {
                console.error("Failed to fetch menu images:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchImages();
    }, []);

    if (loading) {
        return (
             <div className="h-48 p-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="aspect-square rounded-md" />)}
             </div>
        )
    }

    if (images.length === 0) {
        return <div className="h-48 flex items-center justify-center text-center text-muted-foreground bg-muted rounded-md p-4">No images found. Please add image filenames to <code className="bg-background p-1 rounded">src/lib/placeholder-images.json</code> and ensure the files are in the <code className="bg-background p-1 rounded">public/main</code> directory.</div>;
    }

    return (
        <ScrollArea className="h-48 rounded-md border">
            <div className="p-4 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                {images.map(imageName => (
                    <button
                        key={imageName}
                        type="button"
                        onClick={() => onSelectImage(imageName)}
                        className={cn(
                            "relative aspect-square rounded-md overflow-hidden transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                            selectedImage === imageName && "ring-2 ring-primary ring-offset-2"
                        )}
                    >
                        <Image
                            src={`/main/${imageName}`}
                            alt={imageName}
                            fill
                            sizes="100px"
                            className="object-cover"
                        />
                         {selectedImage === imageName && (
                             <div className="absolute inset-0 bg-primary/50" />
                         )}
                    </button>
                ))}
            </div>
        </ScrollArea>
    );
}
