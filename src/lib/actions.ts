
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getFirestore, addDoc, collection } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeFirebase } from "@/firebase";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


const preOrderSchema = z.object({
  studentName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  studentClass: z.string().min(1, { message: "Please select a class." }),
  cart: z.string().refine((val) => {
    try {
      const parsed = JSON.parse(val);
      return typeof parsed === 'object' && Object.keys(parsed).length > 0;
    } catch (e) {
      return false;
    }
  }, { message: "Your cart is empty."}),
  paymentScreenshot: z
    .instanceof(File, { message: "Payment screenshot is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE, `Max file size is 4MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});


export async function handlePreOrder(prevState: any, formData: FormData) {
  const validatedFields = preOrderSchema.safeParse({
    studentName: formData.get("studentName"),
    studentClass: formData.get("studentClass"),
    cart: formData.get("cart"),
    paymentScreenshot: formData.get("paymentScreenshot"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      error: "Please correct the errors in the form.",
    };
  }

  const { firestore, firebaseApp } = initializeFirebase();
  const storage = getStorage(firebaseApp);
  const { studentName, studentClass, cart, paymentScreenshot } = validatedFields.data;

  try {
    // 1. Upload image to Firebase Storage
    const storageRef = ref(storage, `payment_screenshots/${Date.now()}_${paymentScreenshot.name}`);
    const snapshot = await uploadBytes(storageRef, paymentScreenshot);
    const screenshotUrl = await getDownloadURL(snapshot.ref);

    // 2. Save order to Firestore
    await addDoc(collection(firestore, "preOrders"), {
        studentName,
        studentClass,
        items: JSON.parse(cart), // cart is a stringified object
        paymentScreenshotUrl: screenshotUrl,
        status: "Pending",
        pickupDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
     });
    
    revalidatePath("/pre-order");
    revalidatePath("/admin/pre-orders");

    return { message: "Your pre-order has been submitted successfully! You will be notified when it's ready for pickup." };
  } catch(e: any) {
    console.error(e);
    return { error: `Failed to submit pre-order. ${e.message}` };
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
