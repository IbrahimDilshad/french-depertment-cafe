
import { google } from "googleapis";
import path from "path";
import { Readable } from "stream";

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
        body: Readable.from(buffer),
      },
      // IMPORTANT: This tells the API we are working with a Shared Drive.
      supportsAllDrives: true,
      fields: 'id, webViewLink' // Request the webViewLink to display
    });

    const fileId = uploaded.data.id;

    if (!fileId) {
        throw new Error("Google Drive upload succeeded but no file ID was returned.");
    }

    // Make file public - this is necessary for anyone to view the link.
    await drive.permissions.create({
      fileId: fileId,
      supportsAllDrives: true, // Also required here
      requestBody: { role: "reader", type: "anyone" },
    });

    // Return the direct view/download link for embedding/linking
    return `https://drive.google.com/uc?id=${fileId}`;
}
