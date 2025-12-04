
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getDatabase, ref, push, set, serverTimestamp } from "firebase/database";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeServerApp } from "@/firebase/server-init";

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

  const { firebaseApp } = initializeServerApp();
  const storage = getStorage(firebaseApp);
  const database = getDatabase(firebaseApp);

  const { studentName, studentClass, cart, paymentScreenshot } = validatedFields.data;

  try {
    // 1. Upload image to Firebase Storage
    const fileRef = storageRef(storage, `payment_screenshots/${Date.now()}_${paymentScreenshot.name}`);
    const snapshot = await uploadBytes(fileRef, paymentScreenshot);
    const screenshotUrl = await getDownloadURL(snapshot.ref);

    // 2. Save order to Realtime Database
    const preOrdersRef = ref(database, "preOrders");
    const newOrderRef = push(preOrdersRef);
    
    await set(newOrderRef, {
        studentName,
        studentClass,
        items: JSON.parse(cart), // cart is a stringified object
        paymentScreenshotUrl: screenshotUrl,
        status: "Pending",
        pickupDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        orderDate: serverTimestamp(),
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
  
    const isTeamAnnouncement = formData.get("audience") === "team";
  
    // In a real app, this would call a Genkit AI flow
    await new Promise(resolve => setTimeout(resolve, 100)); 
  
    const generatedText = isTeamAnnouncement
      ? `Team Update:\n\nPlease be aware of the following: ${topic}. Let's work together to ensure a smooth service.`
      : `Dear students and staff,\n\nWe are excited to announce an update at our café regarding **${topic}**. Come and see what's new!\n\nThank you,\nThe Café Team`;
  
    return {
      announcement: generatedText,
      audience: isTeamAnnouncement ? 'team' : 'website'
    };
  }
