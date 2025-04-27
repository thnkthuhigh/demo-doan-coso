import ClassRegistration from "../models/ClassRegistration.js";

export const getRegistrationsByUserId = async (req, res) => {
  try {
    const registrations = await ClassRegistration.find({
      userId: req.params.userId,
    });
    res.json(registrations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
