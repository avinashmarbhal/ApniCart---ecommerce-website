const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv");
const fs = require("fs")

dotenv.config()

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {

        if (!localFilePath) return null;

        if (!fs.existsSync(localFilePath)) {
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        fs.unlinkSync(localFilePath);
        return response;

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}


const deleteFromCloudinary = async (publicId) => {
    try {
        const result =  await cloudinary.uploader.destroy(publicId)
        console.log("Deleted from cloudinary. Public id",publicId);
        
    } catch (error) {
        console.log("Error deleting form cloudinary", error);
        return null
        
    }
}

const deleteVideoFromCloudinary = async (videoId) => {
    try {
        const deleteResult = await cloudinary.uploader.destroy(videoId, {
            resource_type: 'video',
            invalidate: true // Ensure cached copies are invalidated
        });
        return deleteResult;
    } catch (error) {
        throw new ApiError(
            error?.http_code || 500,
            error?.message || "Error during video deletion"
        );
    }
};




module.exports = {uploadOnCloudinary, deleteFromCloudinary, deleteVideoFromCloudinary}