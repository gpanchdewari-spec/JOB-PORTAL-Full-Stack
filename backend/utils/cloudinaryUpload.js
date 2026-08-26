import cloudinary from "../config/cloudinary.js";

export const uploadPdfBuffer = (buffer, folder = "jobflow/resumes") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "raw",
        format: "pdf",
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
        console.log("RESUME URL:", result.secure_url); 
      },
    );
    stream.end(buffer);

  });
