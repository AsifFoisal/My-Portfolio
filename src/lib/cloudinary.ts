import { v2 as cloudinary } from "cloudinary";

export function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET,
  );
}

export function initCloudinary(): void {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadImage(
  buffer: Buffer,
  filename: string,
): Promise<{ url: string; publicId: string }> {
  initCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "portfolio",
        resource_type: "image",
        public_id: filename.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-").slice(0, 60),
        unique_filename: true,
      },
      (err, result) => {
        if (err || !result) reject(err ?? new Error("Cloudinary upload failed"));
        else resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );
    stream.end(buffer);
  });
}
