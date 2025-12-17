
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
    <Button type="submit" disabled={true} className="w-full">
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
    // Redirect immediately as checkout is disabled
    toast({
        title: "Pre-orders Paused",
        description: "Pre-order services will resume after the winter break.",
        duration: 5000,
    });
    router.push('/pre-order');
  }, [router, toast]);

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

  // Render a minimal version of the page while redirecting
  return (
      <div className="container mx-auto max-w-3xl py-12 px-4">
         <div className="text-center">Redirecting...</div>
      </div>
    );
}


