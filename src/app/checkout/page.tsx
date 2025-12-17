
"use client";

import { useState, useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { handlePreOrder } from "@/lib/actions";
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
  Loader2,
  Upload,
  ShoppingCart,
  Info
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


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

export default function CheckoutPage() {
  const { toast } = useToast();
  const { cart, cartItems, totalCost, clearCart } = useCart();
  const [state, formAction] = useActionState(handlePreOrder, null);
  const [fileName, setFileName] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/pre-order');
    }
  }, [cartItems, router]);

  useEffect(() => {
    if (state?.message) {
      toast({ title: "Success!", description: state.message });
      clearCart();
      router.push('/pre-order');
    }
    if (state?.error) {
      toast({ variant: "destructive", title: "Error", description: state.error });
    }
  }, [state, toast, clearCart, router]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <Button variant="outline" asChild className="mb-8">
          <Link href="/cart">&larr; Back to Cart</Link>
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
               <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle className="font-headline">Important Notice</AlertTitle>
                  <AlertDescription>
                    Please note: All pre-orders placed now will be prepared and available for pickup after the winter break.
                  </AlertDescription>
                </Alert>

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

