import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

console.log("Image controller loaded");

// Upload avatar for a user
export const uploadAvatar = async (req, res) => {
  console.log("=== UPLOAD AVATAR STARTED ===");
  console.log("Request params:", req.params);
  console.log("Request user:", req.user);
  console.log(
    "Request file:",
    req.file
      ? {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          hasCloudinary: !!req.file.cloudinary,
        }
      : "No file"
  );

  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id || req.user.userId;
    const userRole = req.user.role;

    console.log("Processing upload for userId:", userId);
    console.log("Current user ID:", currentUserId, "Role:", userRole);

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      console.log("User not found:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User found:", user.username);

    // Check permission: admin có thể upload cho bất kỳ ai, user chỉ upload cho chính mình
    if (userRole !== "admin" && currentUserId !== userId) {
      console.log("Permission denied");
      return res
        .status(403)
        .json({ message: "Không có quyền cập nhật avatar này" });
    }

    console.log("Permission check passed");

    // Check file và cloudinary result
    if (!req.file) {
      console.log("No file received");
      return res.status(400).json({ message: "No file received" });
    }

    // Kiểm tra có cloudinary result hoặc path từ multer-storage-cloudinary
    const imageUrl = req.file.path || req.file.secure_url || req.file.url;
    const publicId = req.file.filename || req.file.public_id;

    if (!imageUrl) {
      console.log("No image URL found");
      return res.status(400).json({ message: "Image upload failed - no URL" });
    }

    console.log("Image URL:", imageUrl);
    console.log("Public ID:", publicId);

    // Create new avatar object
    const newAvatarData = {
      public_id: publicId,
      url: imageUrl,
    };

    console.log("New avatar data:", newAvatarData);

    // Delete old avatar if exists
    if (user.avatar && user.avatar.public_id) {
      console.log("Deleting old avatar:", user.avatar.public_id);
      try {
        const deleteResult = await cloudinary.uploader.destroy(
          user.avatar.public_id
        );
        console.log("Old avatar deletion result:", deleteResult);
      } catch (deleteError) {
        console.error("Error deleting old avatar:", deleteError);
        // Continue anyway
      }
    }

    // Update user avatar
    console.log("Updating user avatar...");
    user.avatar = newAvatarData;
    await user.save();

    console.log("User saved successfully");

    // Get updated user without password
    const updatedUser = await User.findById(userId).select("-password");
    console.log("Retrieved updated user");

    console.log("=== UPLOAD AVATAR SUCCESS ===");
    return res.status(200).json({
      message: "Avatar uploaded successfully",
      avatar: newAvatarData,
      user: updatedUser,
    });
  } catch (error) {
    console.error("=== UPLOAD AVATAR ERROR ===");
    console.error("Error details:", error);

    return res.status(500).json({
      message: "Server error uploading avatar",
      error: error.message,
    });
  }
};

// Delete avatar function
export const deleteAvatar = async (req, res) => {
  console.log("=== DELETE AVATAR STARTED ===");

  try {
    const userId = req.params.userId;
    const currentUserId = req.user.id || req.user.userId;
    const userRole = req.user.role;

    console.log("Delete avatar for userId:", userId);

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check permission
    if (userRole !== "admin" && currentUserId !== userId) {
      return res.status(403).json({ message: "Không có quyền xóa avatar này" });
    }

    if (!user.avatar || !user.avatar.public_id) {
      return res.status(400).json({ message: "User doesn't have an avatar" });
    }

    // Delete from Cloudinary
    try {
      const deleteResult = await cloudinary.uploader.destroy(
        user.avatar.public_id
      );
      console.log("Avatar deletion result:", deleteResult);
    } catch (error) {
      console.error("Error deleting avatar from Cloudinary:", error);
    }

    // Remove avatar from user
    user.avatar = null;
    await user.save();

    const updatedUser = await User.findById(userId).select("-password");

    console.log("=== DELETE AVATAR SUCCESS ===");
    return res.status(200).json({
      message: "Avatar deleted successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("=== DELETE AVATAR ERROR ===");
    console.error("Error details:", error);

    return res.status(500).json({
      message: "Server error deleting avatar",
      error: error.message,
    });
  }
};

// Upload general image (admin only) - Giữ nguyên để không ảnh hưởng Image Manager
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    console.log("Upload general image file details:", req.file);

    // Get the uploaded image URL - check all possible properties
    const imageUrl = req.file.path || req.file.secure_url || req.file.url;
    const publicId = req.file.filename || req.file.public_id;

    if (!imageUrl) {
      console.error("Error: No URL found in file object", req.file);
      return res
        .status(500)
        .json({ message: "No URL found in upload response" });
    }

    // Create image object
    const imageData = {
      public_id: publicId,
      url: imageUrl,
    };

    console.log("General image data:", imageData);

    return res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
      publicId: publicId,
      filename: req.file.originalname || `image-${Date.now()}`,
      size: req.file.size,
      format: req.file.mimetype?.split("/")[1],
      width: req.file.width,
      height: req.file.height,
    });
  } catch (error) {
    console.error("Error uploading general image:", error);
    return res.status(500).json({
      message: "Server error uploading image",
      error: error.message,
    });
  }
};

// Get all images (admin only) - Giữ nguyên cho Image Manager
export const getAllImages = async (req, res) => {
  try {
    // Get images from Cloudinary
    const { max_results = 20, next_cursor } = req.query;

    const options = {
      resource_type: "image",
      max_results: parseInt(max_results),
      type: "upload",
    };

    if (next_cursor) {
      options.next_cursor = next_cursor;
    }

    const result = await cloudinary.api.resources(options);

    // Filter gym-images sau khi lấy về (không bao gồm avatars)
    const filteredResources = result.resources.filter(
      (resource) =>
        resource.public_id.startsWith("gym-images/") ||
        (!resource.public_id.startsWith("avatars/") && !resource.folder)
    );

    const images = filteredResources.map((resource) => ({
      publicId: resource.public_id,
      filename: resource.filename || resource.public_id.split("/").pop(),
      url: resource.secure_url,
      size: resource.bytes,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      uploadDate: resource.created_at,
      tags: resource.tags || [],
    }));

    return res.status(200).json({
      images,
      total_count: filteredResources.length,
      next_cursor: result.next_cursor,
    });
  } catch (error) {
    console.error("Error fetching images:", error);
    return res.status(500).json({
      message: "Server error fetching images",
      error: error.message,
    });
  }
};

// Delete image by public_id (admin only) - Giữ nguyên cho Image Manager
export const deleteImage = async (req, res) => {
  try {
    const publicId = req.params.publicId || req.params.public_id;
    const decodedPublicId = decodeURIComponent(publicId);

    console.log("Deleting image with public_id:", decodedPublicId);

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(decodedPublicId);

    // If this is an avatar, also update the user
    const user = await User.findOne({ "avatar.public_id": decodedPublicId });
    if (user) {
      user.avatar = null;
      await user.save();
      console.log("Also removed avatar from user:", user.username);
    }

    if (result.result === "ok") {
      return res.status(200).json({
        message: "Image deleted successfully",
        publicId: decodedPublicId,
      });
    } else {
      return res.status(404).json({
        message: "Image not found or already deleted",
        result: result,
      });
    }
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({
      message: "Server error deleting image",
      error: error.message,
    });
  }
};
