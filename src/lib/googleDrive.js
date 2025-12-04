
import { google } from "googleapis";
import path from "path";

const getDriveClient = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "drive-key.json"),
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
};

export async function uploadFileToDrive(file) {
    if (!file) {
        throw new Error("No file provided for upload.");
    }

    const drive = getDriveClient();

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Google Drive
    const uploaded = await drive.files.create({
      requestBody: {
        name: file.name,
        // The folder ID for "LeFrenchCafe-Screenshots"
        parents: ["1ZwZbhi5jlRNarBZIW3nCeM5a-_dN-gPl"], 
      },
      media: {
        mimeType: file.type,
        body: buffer,
      },
      fields: 'id' // Only request the file ID
    });

    if (!uploaded.data.id) {
        throw new Error("Google Drive upload succeeded but no file ID was returned.");
    }

    const fileId = uploaded.data.id;

    // Make file public
    await drive.permissions.create({
      fileId: fileId,
      requestBody: { role: "reader", type: "anyone" },
    });

    // Return the direct view/download link
    return `https://drive.google.com/uc?id=${fileId}`;
}
