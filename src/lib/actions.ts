
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { getDatabase, ref, push, set, serverTimestamp } from "firebase/database";
import { initializeServerApp } from "@/firebase/server-init";
import { headers } from 'next/headers';

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
  const database = getDatabase(firebaseApp);

  const { studentName, studentClass, cart, paymentScreenshot } = validatedFields.data;

  try {
    // 1. Upload image via our API endpoint to Google Drive
    const uploadFormData = new FormData();
    uploadFormData.append('file', paymentScreenshot);

    const headersList = headers();
    const host = headersList.get('host') || 'localhost:9002';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: uploadFormData,
    });
    
    if (!uploadResponse.ok) {
        const errorBody = await uploadResponse.json().catch(() => ({ error: 'Upload failed with non-JSON response' }));
        console.error("Upload API error response:", errorBody);
        throw new Error(errorBody.error || `Upload to Google Drive failed with status: ${uploadResponse.status}`);
    }

    const uploadResult = await uploadResponse.json();
    const screenshotUrl = uploadResult.url;


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
    console.error("Pre-order submission error:", e);
    return { error: `Failed to submit pre-order. ${e.message}` };
  }
}
