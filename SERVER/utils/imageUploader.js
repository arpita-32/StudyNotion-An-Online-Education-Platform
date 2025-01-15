const cloudinary = require('cloudinary').v2;

exports.uploadImageToCloudinary = async (file, folder, innerHeight, quality) => {
    const options = { folder }; // Initialize options with the folder
    if (innerHeight) { // Use the correct parameter
        options.height = innerHeight;
    }
    if (quality) {
        options.quality = quality;
    }
    options.resource_type = "auto"; // Ensure resource type is set

    return await cloudinary.uploader.upload(file.tempFilePath, options);
};
