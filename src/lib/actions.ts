
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

    return { message: "Your pre-order has been submitted successfully!" };
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

  const generatedText = `Dear students and staff,

We are excited to announce a new update at "Le French Café" regarding **${topic}**. Come check out our new offerings and enjoy a relaxing moment.

Thank you for your continued support!

Best,
The Le French Café Team`;

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
