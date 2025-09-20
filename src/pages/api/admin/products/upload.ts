// src/pages/api/admin/products/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

// ⛔ Disable Next.js body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// ✅ Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ✅ Use require for formidable
const formidable = require("formidable");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  try {
    const form = formidable({
      multiples: false,
      uploadDir: path.join(process.cwd(), "/tmp"),
      keepExtensions: true,
    });

    form.parse(req, async (err: any, fields: any, files: any) => {
      if (err) {
        console.error("Formidable error:", err);
        return res.status(500).json({ message: "File parsing failed" });
      }

      const file = files.file?.[0] || files.file;
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      try {
        const uploadResult = await cloudinary.uploader.upload(file.filepath, {
          folder: "products",
        });

        fs.unlinkSync(file.filepath);

        return res.status(200).json({
          message: "File uploaded successfully",
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError);
        return res.status(500).json({ message: "Cloudinary upload failed" });
      }
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
