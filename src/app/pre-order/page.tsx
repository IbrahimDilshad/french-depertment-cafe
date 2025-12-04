
"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { useCollection } from "@/firebase";
import { handlePreOrder } from "@/lib/actions";
import { MenuItem } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ShoppingCart,
  Loader2,
  PlusCircle,
  MinusCircle,
  Upload,
} from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Order...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" /> Confirm & Place Order
        </>
      )}
    </Button>
  );
}

export default function PreOrderPage() {
  const { data: menuItems, loading } = useCollection<MenuItem>("menuItems");
  const { toast } = useToast();
  const [state, formAction] = useActionState(handlePreOrder, null);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [step, setStep] = useState<"menu" | "checkout">("menu");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (state?.message) {
      toast({ title: "Success!", description: state.message });
      setCart({});
      setStep("menu");
      setFileName("");
      // Reset form fields if possible, maybe need a form ref
    }
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast]);

  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id) || PlaceHolderImages[0];
  };

  const addToCart = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const availableItems = menuItems.filter(
    (item) => item.availability === "In Stock"
  );
  
  const cartItems = Object.keys(cart).map(itemId => {
      const item = menuItems.find(mi => mi.id === itemId);
      return { ...item!, quantity: cart[itemId] };
  });

  const totalCost = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading menu...</p>
      </div>
    );
  }

  if (step === "checkout") {
    return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <Button variant="outline" onClick={() => setStep("menu")} className="mb-8">
          &larr; Back to Menu
        </Button>
        <Card className="shadow-lg">
          <form action={formAction}>
            <input type="hidden" name="cart" value={JSON.stringify(cart)} />
            <CardHeader>
              <CardTitle>Confirm Your Order</CardTitle>
              <CardDescription>
                Please provide your details and payment confirmation.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                    {cartItems.map(item => (
                        <li key={item.id} className="flex justify-between">
                            <span>{item.name} x {item.quantity}</span>
                            <span>Rs{(item.price * item.quantity).toFixed(0)}</span>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-between font-bold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>Rs{totalCost.toFixed(0)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentName">Student Name</Label>
                <Input id="studentName" name="studentName" placeholder="John Doe" required />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="studentClass">Class</Label>
                <Select name="studentClass" required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select your class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Grade 9">Grade 9</SelectItem>
                        <SelectItem value="Grade 10">Grade 10</SelectItem>
                        <SelectItem value="Grade 11">Grade 11</SelectItem>
                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                        <SelectItem value="Staff">Staff</SelectItem>
                    </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Payment</Label>
                <div className="bg-muted p-4 rounded-md text-sm mt-2 space-y-2">
                    <p>Please send <strong className="text-primary">Rs{totalCost.toFixed(0)}</strong> to the following account:</p>
                    <p className="font-mono bg-background p-2 rounded-md">Easypaisa / Sada Pay: 03703702440</p>
                    <p>After payment, upload a screenshot below.</p>
                </div>
              </div>

              <div>
                <Label htmlFor="paymentScreenshot">Payment Screenshot</Label>
                <div className="mt-2">
                    <label className="flex items-center gap-2 cursor-pointer justify-center w-full px-4 py-2 border-2 border-dashed rounded-md hover:bg-muted">
                        <Upload className="h-5 w-5 text-muted-foreground"/>
                        <span className="text-sm text-muted-foreground">{fileName || "Click to upload screenshot"}</span>
                        <Input id="paymentScreenshot" name="paymentScreenshot" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} required />
                    </label>
                </div>
                 {state?.errors?.paymentScreenshot && <p className="text-sm font-medium text-destructive mt-2">{state.errors.paymentScreenshot[0]}</p>}
              </div>

            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-headline text-primary mb-2">
          Pre-order Menu
        </h1>
        <p className="text-lg text-muted-foreground">
          Order ahead for next-day pickup. All in-stock items are available.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        <div className="md:col-span-2 lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableItems.map((item) => {
              const image = getImage(item.imageId);
              return (
                <Card key={item.id} className="flex flex-col">
                  <CardHeader className="p-0">
                     <Image
                        src={image.imageUrl}
                        alt={item.name}
                        width={300}
                        height={200}
                        className="object-cover w-full h-40 rounded-t-lg"
                        data-ai-hint={image.imageHint}
                      />
                  </CardHeader>
                  <CardContent className="flex-1 p-4">
                     <CardTitle className="text-lg font-headline">{item.name}</CardTitle>
                     <CardDescription className="text-sm mt-1 h-10">{item.description}</CardDescription>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between items-center">
                    <p className="font-bold text-primary">Rs{item.price.toFixed(0)}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id)} disabled={!cart[item.id]}>
                        <MinusCircle className="h-4 w-4" />
                      </Button>
                      <span className="w-4 text-center">{cart[item.id] || 0}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => addToCart(item.id)}>
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="md:col-span-1">
          <Card className="sticky top-24 shadow-lg">
            <CardHeader>
              <CardTitle>Your Cart</CardTitle>
              <CardDescription>Review your items before checkout.</CardDescription>
            </CardHeader>
            <CardContent>
              {cartItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">Your cart is empty.</p>
              ) : (
                <ul className="space-y-3">
                    {cartItems.map(item => (
                        <li key={item.id} className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium">{item.name}</p>
                                <p className="text-muted-foreground">Rs{item.price.toFixed(0)} x {item.quantity}</p>
                            </div>
                             <p className="font-semibold">Rs{(item.price * item.quantity).toFixed(0)}</p>
                        </li>
                    ))}
                </ul>
              )}
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <div className="w-full flex justify-between font-bold text-lg border-t pt-4">
                <span>Total</span>
                <span>Rs{totalCost.toFixed(0)}</span>
              </div>
              <Button className="w-full" onClick={() => setStep('checkout')} disabled={cartItems.length === 0}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Proceed to Checkout
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
