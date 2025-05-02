import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setUser }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier || !password) {
      setError("Vui lòng nhập email/username/số điện thoại và mật khẩu.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",
        { identifier, password },
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      navigate("/");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Không thể kết nối đến server. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Đăng Nhập</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="identifier" className="block text-sm font-medium">
              Email / Username / Số điện thoại
            </label>
            <input
              id="identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Nhập email, username hoặc số điện thoại"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="●●●●●●●●"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
          >
            Đăng Nhập
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Chưa có tài khoản?{" "}
          <Link to="/sign-up" className="text-indigo-600 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}
