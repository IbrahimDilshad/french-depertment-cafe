
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
import { useCollection, useDatabase, useUser } from '@/firebase';
import { MenuItem, Sale } from '@/lib/types';
import { ref, push, set, serverTimestamp, update } from "firebase/database";
import { Skeleton } from '@/components/ui/skeleton';

export default function VolunteerDashboard() {
  const { toast } = useToast();
  const db = useDatabase();
  const { user } = useUser();
  const { data: menuItems, loading } = useCollection<MenuItem>("menuItems");
  
  const [sales, setSales] = useState<Record<string, number>>({});

  const handleSale = async (item: MenuItem) => {
    if (!db || !user) {
        toast({ variant: 'destructive', title: "Error", description: `You must be logged in to record a sale.` });
        return;
    };

    if (item.stock <= 0) {
      toast({ variant: 'destructive', title: "Out of Stock", description: `${item.name} is currently out of stock.` });
      return;
    }
    
    const saleData: Omit<Sale, 'id' | 'timestamp'> & { timestamp: any } = {
        itemId: item.id,
        itemName: item.name,
        quantity: 1,
        price: item.price,
        volunteerId: user.uid,
        timestamp: serverTimestamp()
    };

    try {
        // Record the sale
        const salesRef = ref(db, 'sales');
        const newSaleRef = push(salesRef);
        await set(newSaleRef, saleData);

        // Decrement stock
        const itemRef = ref(db, `menuItems/${item.id}`);
        await update(itemRef, { stock: item.stock - 1 });

        setSales(prev => ({...prev, [item.id]: (prev[item.id] || 0) + 1}));
        toast({ title: "Sale Recorded", description: `One sale of ${item.name} recorded.` });
    } catch(e: any) {
        toast({ variant: 'destructive', title: "Error", description: `Could not record sale: ${e.message}` });
    }
  };

  const handleRefillRequest = (itemName: string) => {
    // This is a placeholder for a more complex notification system.
    // In a real app, this might send an email, push notification, or create a task for an admin.
    console.log(`Refill requested for ${itemName} by ${user?.email}`);
    toast({ title: "Refill Requested", description: `An admin has been notified to refill ${itemName}.` });
  }

  const dailyItems = menuItems.filter(item => !item.isPreOrderOnly && item.availability === 'In Stock');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline">Volunteer Dashboard</h1>
        <p className="text-muted-foreground mt-1">Record sales for items available today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && Array.from({length: 3}).map((_, i) => (
             <Card key={i}><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-10 w-full" /></CardContent><CardFooter className="grid grid-cols-2 gap-2"><Skeleton className="h-10 w-full" /><Skeleton className="h-10 w-full" /></CardFooter></Card>
        ))}
        {dailyItems.map(item => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{item.name}</CardTitle>
                <Badge variant={item.stock > 10 ? 'secondary' : item.stock > 0 ? 'default' : 'destructive'}>
                  {item.stock > 0 ? `${item.stock} in stock` : 'Sold Out'}
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
              <Button onClick={() => handleSale(item)} disabled={item.stock <= 0}>
                <PlusCircle className="mr-2 h-4 w-4" /> Log Sale
              </Button>
              <Button variant="outline" onClick={() => handleRefillRequest(item.name)}>
                 <Bell className="mr-2 h-4 w-4" /> Request Refill
              </Button>
            </CardFooter>
          </Card>
        ))}
        {!loading && dailyItems.length === 0 && (
            <div className="col-span-full text-center py-16">
                <p className="text-muted-foreground">There are no daily items available for sale at this time.</p>
            </div>
        )}
      </div>
    </div>
  );
}
