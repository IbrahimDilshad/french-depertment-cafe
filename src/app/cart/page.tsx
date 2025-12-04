
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MinusCircle, PlusCircle, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MenuItem } from "@/lib/types";

export default function CartPage() {
    const { cartItems, totalCost, removeFromCart, addToCart, updateQuantity } = useCart();
    const { toast } = useToast();

    const handleQuantityChange = (item: MenuItem, value: string) => {
        const quantity = Number(value);
        if (!isNaN(quantity) && quantity >= 0 && quantity <= item.stock) {
            updateQuantity(item.id, quantity);
        } else if (quantity > item.stock) {
             toast({
                variant: "destructive",
                title: "Stock limit reached",
                description: `Only ${item.stock} of ${item.name} available.`,
            });
        }
    };

    const handleAddToCart = (item: MenuItem) => {
        if ((cartItems.find(i => i.id === item.id)?.quantity || 0) + 1 > item.stock) {
            toast({ variant: "destructive", title: "Stock limit reached" });
            return;
        }
        addToCart(item.id);
    }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-headline">Your Shopping Cart</h1>
      </div>

        {cartItems.length === 0 ? (
            <div className="text-center py-16">
                <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
                <Button asChild className="mt-6">
                    <Link href="/pre-order">Browse Pre-order Menu</Link>
                </Button>
            </div>
        ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-4">
                    {cartItems.map(item => {
                         return (
                            <Card key={item.id} className="flex items-center p-4">
                                {item.imageId ? (
                                    <div className="relative w-[100px] h-[100px] rounded-md overflow-hidden">
                                        <Image
                                            src={`/menu/${item.imageId}`}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ): (
                                    <div className="w-[100px] h-[100px] bg-muted rounded-md flex items-center justify-center">
                                        <span className="text-xs text-muted-foreground">No Image</span>
                                    </div>
                                )}
                                <div className="ml-4 flex-grow">
                                    <h3 className="font-semibold">{item.name}</h3>
                                    <p className="text-sm text-muted-foreground">Rs{item.price.toFixed(0)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)}>
                                        <MinusCircle className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                    <Input 
                                        type="number" 
                                        value={item.quantity} 
                                        onChange={(e) => handleQuantityChange(item, e.target.value)}
                                        className="h-8 w-14 text-center"
                                     />
                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleAddToCart(item)}>
                                        <PlusCircle className="h-4 w-4 text-muted-foreground" />
                                    </Button>
                                </div>
                                <div className="ml-4 font-semibold w-20 text-right">
                                    Rs{(item.price * item.quantity).toFixed(0)}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 ml-2 text-destructive hover:text-destructive" onClick={() => updateQuantity(item.id, 0)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </Card>
                         )
                    })}
                </div>

                <div className="lg:col-span-1">
                    <Card className="sticky top-24 shadow-lg">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>Rs{totalCost.toFixed(0)}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Taxes & Fees</span>
                                <span>Rs0.00</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg border-t pt-4">
                                <span>Total</span>
                                <span>Rs{totalCost.toFixed(0)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild>
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        )}
    </div>
  );
}
