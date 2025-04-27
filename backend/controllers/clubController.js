import Club from "../models/Club.js";

// Lấy tất cả CLB
export const getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách CLB", error: error.message });
  }
};

// Thêm CLB mới
export const createClub = async (req, res) => {
  const { name, address, image, description } = req.body;

  try {
    const newClub = new Club({ name, address, image, description });
    await newClub.save();
    res.status(201).json(newClub);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi thêm CLB", error: error.message });
  }
};

// Cập nhật CLB
export const updateClub = async (req, res) => {
  const { id } = req.params;
  const { name, address, image, description } = req.body;

  try {
    const updatedClub = await Club.findByIdAndUpdate(
      id,
      { name, address, image, description },
      { new: true }
    );
    if (!updatedClub) {
      return res.status(404).json({ message: "CLB không tồn tại" });
    }
    res.status(200).json(updatedClub);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật CLB", error: error.message });
  }
};

// Xóa CLB
export const deleteClub = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedClub = await Club.findByIdAndDelete(id);
    if (!deletedClub) {
      return res.status(404).json({ message: "CLB không tồn tại" });
    }
    res.status(204).json({ message: "CLB đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa CLB", error: error.message });
  }
};
