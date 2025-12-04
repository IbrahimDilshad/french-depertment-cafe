
"use client";

import Image from "next/image";
import { useCollection } from "@/firebase";
import { MenuItem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/context/cart-context";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Loader2,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";


export default function PreOrderPage() {
  const { data: menuItems, loading } = useCollection<MenuItem>("menuItems");
  const { toast } = useToast();
  const { cart, addToCart, removeFromCart } = useCart();
  
  const handleAddToCart = (item: MenuItem) => {
    const currentQuantity = cart[item.id] || 0;
    if (currentQuantity < item.stock) {
        addToCart(item.id);
        toast({
            title: "Added to cart",
            description: `${item.name} has been added to your cart.`,
        });
    } else {
        toast({
            variant: "destructive",
            title: "Stock limit reached",
            description: `You cannot add more of ${item.name}.`,
        });
    }
  };

  const availableItems = menuItems.filter(
    (item) => item.isPreOrderOnly && item.availability === "In Stock"
  );
  
  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading menu...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline text-primary mb-2">
          Pre-order Menu
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Order ahead for next-day pickup. Only the items below are available for pre-order. Your cart is in the top right corner.
        </p>
      </div>
      
      {availableItems.length === 0 ? (
          <div className="text-center col-span-full py-16">
              <p className="text-muted-foreground">There are no items available for pre-order at this time.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {availableItems.map((item) => {
              const currentQuantity = cart[item.id] || 0;
              const stockLimitReached = currentQuantity >= item.stock;

              return (
                  <Card key={item.id} className="flex flex-col">
                      <CardHeader className="p-0 relative">
                          {item.imageId && (
                            <Image
                                src={`/main/${item.imageId}`}
                                alt={item.name}
                                width={300}
                                height={200}
                                className="object-cover w-full h-40 rounded-t-lg"
                            />
                          )}
                          <Badge variant="secondary" className="absolute top-2 right-2">{item.stock} in stock</Badge>
                      </CardHeader>
                      <CardContent className="flex-1 p-4">
                          <CardTitle className="text-lg font-headline">{item.name}</CardTitle>
                          <CardDescription className="text-sm mt-1 h-10">{item.description}</CardDescription>
                      </CardContent>
                      <CardFooter className="p-4 flex justify-between items-center">
                          <p className="font-bold text-primary">Rs{item.price.toFixed(0)}</p>
                          {currentQuantity === 0 ? (
                               <Button variant="outline" size="sm" onClick={() => handleAddToCart(item)} disabled={stockLimitReached}>
                                  <PlusCircle className="mr-2 h-4 w-4" /> Add
                              </Button>
                          ) : (
                            <div className="flex items-center gap-2">
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                                    <MinusCircle className="h-4 w-4" />
                                </Button>
                                <span className="w-4 text-center">{currentQuantity}</span>
                                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleAddToCart(item)} disabled={stockLimitReached}>
                                    <PlusCircle className="h-4 w-4" />
                                </Button>
                            </div>
                          )}
                      </CardFooter>
                  </Card>
              );
              })}
          </div>
      )}
    </div>
  );
}
