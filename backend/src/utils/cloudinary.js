import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.COUDINARLY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (filePath, folder = "house-rent") => {
    try {
        if (!filePath) return null;

        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "auto",
            use_filename: true,
            unique_filename: true,
            secure: true,
        });
        fs.unlinkSync(filePath)
        return result;
    } catch (error) {
        fs.unlinkSync(filePath)
        console.error("Error uploading to Cloudinary:", error);
    }
};