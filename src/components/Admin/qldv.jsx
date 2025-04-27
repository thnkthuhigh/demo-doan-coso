import { useState, useEffect } from "react";
import axios from "axios";

export default function AdminServiceManager() {
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // Lấy danh sách dịch vụ từ DB
  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Lỗi khi tải dịch vụ:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `http://localhost:5000/api/services/${editId}`,
          formData
        );
      } else {
        await axios.post("http://localhost:5000/api/services", formData);
      }
      setFormData({ name: "", image: "", description: "" });
      setIsEditing(false);
      setEditId(null);
      fetchServices();
    } catch (err) {
      console.error("Lỗi khi thêm/cập nhật dịch vụ:", err);
    }
  };

  const handleEdit = (service) => {
    setFormData(service);
    setIsEditing(true);
    setEditId(service._id);
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc muốn xóa dịch vụ này không?")) {
      try {
        await axios.delete(`http://localhost:5000/api/services/${id}`);
        fetchServices();
      } catch (err) {
        console.error("Lỗi khi xóa dịch vụ:", err);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center">Quản Lý Dịch Vụ</h2>

      {/* Form Thêm/Sửa */}
      <form
        onSubmit={handleAddOrUpdate}
        className="bg-gray-100 p-6 rounded-lg space-y-4 shadow"
      >
        <input
          type="text"
          name="name"
          placeholder="Tên dịch vụ"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          name="image"
          placeholder="Link hình ảnh"
          value={formData.image}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <textarea
          name="description"
          placeholder="Mô tả dịch vụ"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full p-3 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition"
        >
          {isEditing ? "Cập nhật dịch vụ" : "Thêm dịch vụ"}
        </button>
      </form>

      {/* Danh sách dịch vụ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white p-4 rounded-lg shadow-md space-y-2 relative"
          >
            <img
              src={service.image}
              alt={service.name}
              className="w-full h-40 object-cover rounded"
            />
            <h3 className="text-xl font-semibold">{service.name}</h3>
            <p className="text-gray-600">{service.description}</p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleEdit(service)}
                className="text-blue-600 hover:underline"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(service._id)}
                className="text-red-600 hover:underline"
              >
                Xóa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
