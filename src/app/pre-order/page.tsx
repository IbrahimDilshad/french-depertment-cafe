
"use client";

import { useEffect, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { handlePreOrder } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { menuItems } from "@/lib/placeholder-data";

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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart, Loader2 } from "lucide-react";

const preOrderSchema = z.object({
  studentName: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères." }),
  studentClass: z.string().min(1, { message: "Veuillez sélectionner une classe." }),
  items: z.string().min(1, { message: "Veuillez décrire votre commande." }),
});

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Envoi en cours...
        </>
      ) : (
        <>
          <ShoppingCart className="mr-2 h-4 w-4" /> Soumettre la pré-commande
        </>
      )}
    </Button>
  );
}

export default function PreOrderPage() {
  const { toast } = useToast();
  const [state, formAction] = useActionState(handlePreOrder, null);

  const form = useForm<z.infer<typeof preOrderSchema>>({
    resolver: zodResolver(preOrderSchema),
    defaultValues: {
      studentName: "",
      studentClass: "",
      items: "",
    },
  });

  useEffect(() => {
    if (state?.message) {
      toast({
        title: "Succès!",
        description: state.message,
      });
      form.reset();
    }
    if (state?.errors) {
       // The form displays individual field errors, so a generic toast isn't needed here.
    }
  }, [state, toast, form]);

  const availableItems = menuItems.filter(item => item.availability === 'In Stock');

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-headline text-primary mb-2">
          Pré-commander
        </h1>
        <p className="text-lg text-muted-foreground">
          Commandez à l'avance pour un ramassage le lendemain.
        </p>
      </div>

      <Card className="shadow-lg">
        <form action={formAction}>
          <CardHeader>
            <CardTitle>Votre Commande</CardTitle>
            <CardDescription>
              Remplissez les détails ci-dessous. Les commandes sont pour un ramassage le lendemain matin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Form {...form}>
              <FormField
                control={form.control}
                name="studentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'étudiant</FormLabel>
                    <FormControl>
                      <Input placeholder="Jean Dupont" {...field} name="studentName" />
                    </FormControl>
                    <FormMessage>{state?.errors?.studentName}</FormMessage>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Classe</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} name="studentClass">
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre classe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Grade 9">Grade 9</SelectItem>
                        <SelectItem value="Grade 10">Grade 10</SelectItem>
                        <SelectItem value="Grade 11">Grade 11</SelectItem>
                        <SelectItem value="Grade 12">Grade 12</SelectItem>
                        <SelectItem value="Staff">Personnel</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage>{state?.errors?.studentClass}</FormMessage>
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="items"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Articles souhaités</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ex: 2 croissants, 1 jus d'orange"
                        className="resize-none"
                        {...field}
                        name="items"
                      />
                    </FormControl>
                    <FormDescription>
                     Veuillez lister les articles et les quantités que vous souhaitez commander. Articles disponibles: {availableItems.map(i => i.name).join(', ')}.
                    </FormDescription>
                    <FormMessage>{state?.errors?.items}</FormMessage>
                  </FormItem>
                )}
              />
            </Form>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
