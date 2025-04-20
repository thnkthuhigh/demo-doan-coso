import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function SignUp() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, email, password, confirmPassword, dob, gender } =
      formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        {
          username,
          email,
          password,
          dob: new Date(dob).toISOString(), // chuyển dob về dạng chuẩn ISO
          gender: gender || "other", // nếu chưa chọn gender thì gửi 'other'
        }
      );

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error during signup", error);
      console.log("Full error:", error.response);
      alert(
        error.response?.data?.message ||
          error.message || // Hiển thị thông báo lỗi nếu có
          "An error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full sm:w-96">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit}>
          {[
            { id: "username", type: "text", label: "Username" },
            { id: "email", type: "email", label: "Email" },
            { id: "password", type: "password", label: "Password" },
            {
              id: "confirmPassword",
              type: "password",
              label: "Confirm Password",
            },
            { id: "dob", type: "date", label: "Date of Birth" },
          ].map(({ id, type, label }) => (
            <div className="mb-6" key={id}>
              <label
                htmlFor={id}
                className="block text-sm font-medium text-gray-700"
              >
                {label}
              </label>
              <input
                type={type}
                id={id}
                name={id}
                value={formData[id]}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={`Enter your ${label.toLowerCase()}`}
              />
            </div>
          ))}

          <div className="mb-6">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-900 focus:outline-none"
          >
            Sign Up
          </button>

          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              Already have an account?
              <a href="/login" className="text-indigo-600 ml-1">
                Login
              </a>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
