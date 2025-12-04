import { drive } from "@/lib/googleDrive";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ error: "No file uploaded" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Google Drive
    const uploaded = await drive().files.create({
      requestBody: {
        name: file.name,
        parents: ["1ZwZbhi5jlRNarBZIW3nCeM5a-_dN-gPl"], // <-- Replace this!
      },
      media: {
        mimeType: file.type,
        body: buffer,
      },
    });

    // Make file public
    await drive().permissions.create({
      fileId: uploaded.data.id,
      requestBody: { role: "reader", type: "anyone" },
    });

    const url = `https://drive.google.com/uc?id=${uploaded.data.id}`;

    return Response.json({
      fileId: uploaded.data.id,
      url,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json({ error: "Upload failed" }, { status: 500 });
  }
}
