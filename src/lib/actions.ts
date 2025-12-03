"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

const preOrderSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  studentClass: z.string().min(1, { message: "Please select a class." }),
  items: z.string().min(3, { message: "Please list the items you want to order." }),
});

export async function handlePreOrder(prevState: any, formData: FormData) {
  const validatedFields = preOrderSchema.safeParse({
    studentName: formData.get("studentName"),
    studentClass: formData.get("studentClass"),
    items: formData.get("items"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { firestore } = initializeFirebase();

  try {
     await addDoc(collection(firestore, "preOrders"), {
        ...validatedFields.data,
        status: "Pending",
        pickupDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
     });
    
    revalidatePath("/pre-order");
    revalidatePath("/admin/pre-orders");

    return { message: "Votre pré-commande a été soumise avec succès!" };
  } catch(e) {
    return { errors: { _form: ["Failed to submit pre-order."] } };
  }
}

export async function generateAnnouncement(prevState: any, formData: FormData) {
  const topic = formData.get("topic") as string;

  if (!topic || topic.trim() === "") {
    return {
      error: "Please provide a topic for the announcement.",
    };
  }

  // In a real app, this would call the Genkit AI flow
  await new Promise(resolve => setTimeout(resolve, 1500));

  const generatedText = `Chers étudiants et personnel,

Nous sommes ravis de vous annoncer une nouveauté à "Le French Café" concernant **${topic}**. Venez découvrir nos nouvelles offres et profitez d'un moment de détente.

Merci de votre soutien continu!

Cordialement,
L'équipe du French Café`;

  return {
    announcement: generatedText,
  };
}

export async function recordSale(itemId: string, quantity: number) {
    console.log(`Recorded sale: ${quantity} of item ${itemId}`);
    // In a real app, you would update Firestore here and decrement stock.
    revalidatePath("/volunteer");
    revalidatePath("/");
    revalidatePath("/admin/analytics");
}
