
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Bell } from 'lucide-react';
import { useCollection, useFirestore } from '@/firebase';
import { MenuItem, Sale } from '@/lib/types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function VolunteerDashboard() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { data: menuItems, loading } = useCollection<MenuItem>("menuItems");
  
  const [sales, setSales] = useState<Record<string, number>>({});

  const handleSale = async (item: MenuItem) => {
    if (!firestore) return;
    
    const saleData: Omit<Sale, 'id' | 'timestamp'> & { timestamp: any } = {
        itemId: item.id,
        itemName: item.name,
        quantity: 1,
        price: item.price,
        volunteerId: 'volunteer-pos', // Placeholder until auth is back
        timestamp: serverTimestamp()
    };

    try {
        await addDoc(collection(firestore, 'sales'), saleData);
        setSales(prev => ({...prev, [item.id]: (prev[item.id] || 0) + 1}));
        toast({ title: "Sale Recorded", description: `One sale of ${item.name} recorded.` });
    } catch(e: any) {
        toast({ variant: 'destructive', title: "Error", description: `Could not record sale: ${e.message}` });
    }
  };

  const handleRefillRequest = (itemName: string) => {
    toast({ title: "Refill Requested", description: `A refill has been requested for ${itemName}.` });
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline">Volunteer Dashboard</h1>
      <p className="text-muted-foreground">Welcome! Here is the stock for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && Array.from({length: 3}).map((_, i) => (
             <Card key={i}><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent><CardFooter className="grid grid-cols-2 gap-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardFooter></Card>
        ))}
        {menuItems.filter(item => item.availability === 'In Stock').map(item => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{item.name}</CardTitle>
                <Badge variant={item.stock > 10 ? 'secondary' : 'destructive'}>
                  {item.stock} in stock
                </Badge>
              </div>
              <CardDescription>Price: Rs{item.price.toFixed(0)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
               <div className="flex items-center justify-center space-x-4 p-4 bg-muted rounded-lg">
                    <span className="text-lg font-semibold">Sales Today:</span>
                    <span className="text-2xl font-bold text-primary">{sales[item.id] || 0}</span>
               </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleSale(item)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Log Sale
              </Button>
              <Button variant="outline" onClick={() => handleRefillRequest(item.name)}>
                 <Bell className="mr-2 h-4 w-4" /> Request Refill
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
