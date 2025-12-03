"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const preOrderSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  studentClass: z.string().min(1, { message: "Please select a class." }),
});

// This is a placeholder. In a real app, you would save to a database.
export async function handlePreOrder(prevState: any, formData: FormData) {
  const validatedFields = preOrderSchema.safeParse({
    studentName: formData.get("studentName"),
    studentClass: formData.get("studentClass"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Placeholder for saving data
  console.log("Pre-order submitted:", {
    studentName: formData.get("studentName"),
    studentClass: formData.get("studentClass"),
    items: formData.get("items"),
  });
  
  revalidatePath("/pre-order");

  return { message: "Votre pré-commande a été soumise avec succès!" };
}

// This is a placeholder for the AI assistant.
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
}
