import { useState } from "react";

export default function AdminServiceManager() {
  const [services, setServices] = useState([
    {
      name: "FITNESS",
      image: "/fitness.jpg",
      description: "Tập gym cá nhân với HLV chuyên nghiệp.",
    },
    {
      name: "YOGA",
      image: "/yoga.jpg",
      description: "Yoga giúp thư giãn tinh thần và tăng sự dẻo dai.",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    description: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Sửa dịch vụ
      const updated = [...services];
      updated[editIndex] = formData;
      setServices(updated);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Thêm dịch vụ mới
      setServices([...services, formData]);
    }
    setFormData({ name: "", image: "", description: "" });
  };

  const handleEdit = (index) => {
    setFormData(services[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (confirm("Bạn có chắc muốn xóa dịch vụ này không?")) {
      const updated = services.filter((_, i) => i !== index);
      setServices(updated);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h2 className="text-3xl font-bold text-center">Quản Lý Dịch Vụ</h2>

      {/* Form Thêm/Sửa */}
      <form
        onSubmit={handleAdd}
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
        {services.map((service, index) => (
          <div
            key={index}
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
                onClick={() => handleEdit(index)}
                className="text-blue-600 hover:underline"
              >
                Sửa
              </button>
              <button
                onClick={() => handleDelete(index)}
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
