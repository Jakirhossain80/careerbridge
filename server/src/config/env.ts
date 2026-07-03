import "dotenv/config";

const env = {
  port: process.env.PORT || "5000",
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  // MongoDB
  mongoUri: process.env.MONGODB_URI || "",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "",

  // Cloudinary
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
  cloudinaryUploadFolder:
    process.env.CLOUDINARY_UPLOAD_FOLDER || "careerbridge",
};

export default env;
