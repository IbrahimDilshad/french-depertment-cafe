import { google } from "googleapis";
import path from "path";
import fs from "fs";

export const drive = () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(process.cwd(), "drive-key.json"),
    scopes: ["https://www.googleapis.com/auth/drive"],
  });

  return google.drive({ version: "v3", auth });
};
