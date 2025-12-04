
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Trash2, X, ShoppingCart } from 'lucide-react';
import { useCollection, useDatabase, useUser } from '@/firebase';
import { MenuItem, Sale } from '@/lib/types';
import { ref, set, push, update, increment, serverTimestamp } from "firebase/database";
import { Skeleton } from '@/components/ui/skeleton';

type CartItem = MenuItem & { quantity: number };

export default function PointOfSalePage() {
  const { toast } = useToast();
  const db = useDatabase();
  const { user } = useUser();
  const { data: menuItems, loading } = useCollection<MenuItem>("menuItems");
  
  const [cart, setCart] = useState<Record<string, CartItem>>({});
  
  const totalCost = Object.values(cart).reduce((acc, item) => acc + item.price * item.quantity, 0);

  const addToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart[item.id];
      const newQuantity = (existingItem?.quantity || 0) + 1;

      if (newQuantity > item.stock) {
        toast({
          variant: 'destructive',
          title: "Stock limit reached",
          description: `Only ${item.stock} of ${item.name} available.`
        });
        return prevCart;
      }
      
      const newCart = { ...prevCart };
      newCart[item.id] = { ...item, quantity: newQuantity };
      return newCart;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => {
      const newCart = { ...prevCart };
      if (newCart[itemId]?.quantity > 1) {
        newCart[itemId].quantity -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const clearCart = () => {
    setCart({});
  };

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) {
      toast({ variant: 'destructive', title: "Error", description: "Cart is empty." });
      return;
    }
    if (!db || !user) {
        toast({ variant: 'destructive', title: "Error", description: `You must be logged in to record a sale.` });
        return;
    };

    const saleTimestamp = serverTimestamp();
    const updates: Record<string, any> = {};
    
    // Prepare updates for all items in the cart
    for (const item of Object.values(cart)) {
      // 1. Record each sale
      const saleData = {
        itemId: item.id,
        itemName: item.name,
        quantity: item.quantity,
        price: item.price,
        volunteerId: user.uid,
        timestamp: saleTimestamp
      };
      const newSaleKey = push(ref(db, 'sales')).key;
      updates[`/sales/${newSaleKey}`] = saleData;

      // 2. Decrement stock for each item
      updates[`/menuItems/${item.id}/stock`] = increment(-item.quantity);
    }

    try {
      await update(ref(db), updates);
      toast({ title: "Sale Complete", description: "The transaction has been recorded and stock updated." });
      clearCart();
    } catch(e: any) {
        toast({ variant: 'destructive', title: "Checkout Error", description: `Could not complete the sale: ${e.message}` });
    }
  }

  const dailyItems = menuItems.filter(item => !item.isPreOrderOnly && item.availability === 'In Stock');

  return (
    <div className="h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-headline">Point of Sale</h1>
        <p className="text-muted-foreground mt-1">Select items to build a customer's order.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6 flex-1">
        {/* Menu Items */}
        <div className="lg:col-span-2">
           <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loading && Array.from({length: 6}).map((_, i) => (
                    <Card key={i}><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-4 w-1/2" /></CardContent></Card>
                ))}
                {dailyItems.map(item => (
                  <Card 
                    key={item.id} 
                    onClick={() => addToCart(item)}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary ${item.stock <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <CardDescription>Rs{item.price.toFixed(0)}</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <Badge variant={item.stock > 10 ? 'secondary' : item.stock > 0 ? 'default' : 'destructive'}>
                          {item.stock > 0 ? `${item.stock} left` : 'Sold Out'}
                        </Badge>
                    </CardContent>
                  </Card>
                ))}
                {!loading && dailyItems.length === 0 && (
                    <div className="col-span-full text-center py-16">
                        <p className="text-muted-foreground">There are no daily items available for sale.</p>
                    </div>
                )}
             </div>
           </ScrollArea>
        </div>

        {/* Cart */}
        <div className="lg:col-span-1">
            <Card className="flex flex-col h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Current Order</CardTitle>
                     {Object.keys(cart).length > 0 && (
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearCart}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Clear Cart</span>
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-[calc(100vh-22rem)]">
                      <div className="px-6 space-y-4">
                        {Object.keys(cart).length === 0 ? (
                          <div className="text-center text-sm text-muted-foreground pt-16">
                            Click on items to add them to the order.
                          </div>
                        ) : (
                          Object.values(cart).map(item => (
                            <div key={item.id} className="flex items-center gap-4">
                              <div className="flex-1">
                                <p className="font-medium leading-tight">{item.name}</p>
                                <p className="text-sm text-muted-foreground">Rs{item.price.toFixed(0)}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => removeFromCart(item.id)}><Minus className="h-3 w-3"/></Button>
                                <span className="font-bold w-4 text-center">{item.quantity}</span>
                                <Button size="icon" variant="outline" className="h-6 w-6" onClick={() => addToCart(item)}><Plus className="h-3 w-3"/></Button>
                              </div>
                               <p className="w-16 text-right font-medium">Rs{(item.price * item.quantity).toFixed(0)}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 mt-auto border-t p-6">
                    <div className="flex justify-between w-full font-bold text-lg">
                        <span>Total</span>
                        <span>Rs{totalCost.toFixed(0)}</span>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleCheckout} 
                      disabled={Object.keys(cart).length === 0 || loading}
                    >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Complete Sale
                    </Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
