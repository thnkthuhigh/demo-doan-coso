import { useState } from "react";

export default function AdminClubManager() {
  const [clubs, setClubs] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    image: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      const updatedClubs = [...clubs];
      updatedClubs[editIndex] = formData;
      setClubs(updatedClubs);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setClubs([...clubs, formData]);
    }
    setFormData({ name: "", address: "", image: "", description: "" });
  };

  const handleEdit = (index) => {
    setFormData(clubs[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const confirmDelete = confirm("Bạn có chắc muốn xóa CLB này?");
    if (!confirmDelete) return;

    const updatedClubs = [...clubs];
    updatedClubs.splice(index, 1);
    setClubs(updatedClubs);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-center text-blue-700">
        Quản lý CLB Gym
      </h1>

      {/* Form Thêm/Sửa */}
      <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold">
          {isEditing ? "Sửa CLB" : "Thêm CLB mới"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Tên CLB"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="text"
            name="image"
            placeholder="URL ảnh"
            value={formData.image}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <textarea
            name="description"
            placeholder="Mô tả"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            {isEditing ? "Cập nhật CLB" : "Thêm CLB"}
          </button>
        </form>
      </div>

      {/* Danh sách CLB */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clubs.map((club, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-md overflow-hidden"
          >
            <img
              src={club.image}
              alt={club.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-xl font-bold">{club.name}</h2>
              <p className="text-sm text-gray-600">{club.address}</p>
              <p className="text-base">{club.description}</p>
              <div className="flex justify-between mt-4">
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
          </div>
        ))}
      </div>
    </div>
  );
}
