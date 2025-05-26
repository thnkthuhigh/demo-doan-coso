import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Trash2, Upload, Search, RefreshCcw, X } from "lucide-react";
import { toast } from "react-toastify";

const ImageManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const checkAdminAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Vui lòng đăng nhập để tiếp tục");
          navigate("/login");
          return;
        }

        // You can add an API endpoint to verify admin status
        // For now, we'll proceed with fetching images
        fetchImages();
      } catch (error) {
        console.error("Auth error:", error);
        navigate("/");
      }
    };

    checkAdminAuth();
  }, [navigate]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/images/admin/all",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setImages(response.data.images || []);
    } catch (error) {
      console.error("Error fetching images:", error);
      if (error.response?.status === 403) {
        toast.error("Bạn không có quyền truy cập trang này");
        navigate("/");
      } else {
        toast.error("Không thể tải danh sách ảnh");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        "http://localhost:5000/api/images/admin/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImages([...images, response.data.image]);
      toast.success("Tải lên ảnh thành công");

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Tải lên ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (publicId) => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/images/admin/${publicId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImages(images.filter((img) => img.public_id !== publicId));
      setSelectedImage(null);
      toast.success("Xóa ảnh thành công");
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Xóa ảnh thất bại");
    }
  };

  const filteredImages = images.filter((img) =>
    img.public_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý hình ảnh</h1>
          <p className="mt-2 text-gray-600">
            Quản lý tất cả hình ảnh trên hệ thống
          </p>
        </div>

        {/* Action bar */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm kiếm hình ảnh..."
              className="pl-10 w-full rounded-lg border border-gray-300 py-2 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={fetchImages}
              disabled={loading}
              className="flex items-center py-2 px-4 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <RefreshCcw size={18} className="mr-2" />
              <span>Làm mới</span>
            </button>

            <button
              onClick={() => fileInputRef.current.click()}
              disabled={uploading}
              className="flex items-center py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Upload size={18} className="mr-2" />
              <span>{uploading ? "Đang tải lên..." : "Tải lên ảnh"}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Image grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.public_id}
                className={`relative group rounded-lg overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow ${
                  selectedImage?.public_id === image.public_id
                    ? "ring-2 ring-purple-500"
                    : ""
                }`}
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={image.url}
                    alt={image.public_id}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteImage(image.public_id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredImages.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">Không tìm thấy hình ảnh nào</p>
          </div>
        )}

        {/* Image detail modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {selectedImage.public_id}
                </h3>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-4">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.public_id}
                  className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex">
                    <span className="font-medium w-24">ID:</span>
                    <span className="text-gray-600 break-all">
                      {selectedImage.public_id}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24">URL:</span>
                    <span className="text-gray-600 break-all">
                      {selectedImage.url}
                    </span>
                  </div>
                  {selectedImage.format && (
                    <div className="flex">
                      <span className="font-medium w-24">Format:</span>
                      <span className="text-gray-600">
                        {selectedImage.format}
                      </span>
                    </div>
                  )}
                  {selectedImage.bytes && (
                    <div className="flex">
                      <span className="font-medium w-24">Size:</span>
                      <span className="text-gray-600">
                        {Math.round(selectedImage.bytes / 1024)} KB
                      </span>
                    </div>
                  )}
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleDeleteImage(selectedImage.public_id)}
                    className="flex items-center py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={18} className="mr-2" />
                    <span>Xóa ảnh</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageManager;
