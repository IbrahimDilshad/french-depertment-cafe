
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
import { menuItems, volunteers } from "@/lib/placeholder-data";
import { recordSale } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MinusCircle, Bell } from 'lucide-react';

export default function VolunteerDashboard() {
  const { toast } = useToast();
  // Assuming volunteer 'Charles' is logged in
  const volunteer = volunteers[0];
  const assignedItems = menuItems.filter(item => volunteer.assignedStock.includes(item.id));
  
  const [sales, setSales] = useState<Record<string, number>>({});

  const handleSale = async (itemId: string) => {
    await recordSale(itemId, 1);
    setSales(prev => ({...prev, [itemId]: (prev[itemId] || 0) + 1}));
    toast({ title: "Sale Recorded", description: `One sale of ${menuItems.find(i=>i.id===itemId)?.name} recorded.` });
  };

  const handleRefillRequest = (itemName: string) => {
    toast({ title: "Refill Requested", description: `A refill has been requested for ${itemName}.` });
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-headline">Volunteer Dashboard</h1>
      <p className="text-muted-foreground">Welcome, {volunteer.name}. Here is your assigned stock for today.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignedItems.map(item => (
          <Card key={item.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{item.name}</CardTitle>
                <Badge variant={item.stock > 10 ? 'secondary' : 'destructive'}>
                  {item.stock} in stock
                </Badge>
              </div>
              <CardDescription>Price: ${item.price.toFixed(2)}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
               <div className="flex items-center justify-center space-x-4 p-4 bg-muted rounded-lg">
                    <span className="text-lg font-semibold">Sales Today:</span>
                    <span className="text-2xl font-bold text-primary">{sales[item.id] || 0}</span>
               </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-2">
              <Button onClick={() => handleSale(item.id)}>
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
