import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navigation from "./Navigation";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (email === "admin" && password === "123456") {
      localStorage.setItem("currentUser", JSON.stringify({ 
        username: "Administrator",
        role: "admin"
      }));
      alert("Đăng nhập thành công với quyền quản trị viên!");
      navigate("/admin");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
      (user: { username: string; password: string }) =>
        user.username === email && user.password === password
    );

    if (user) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          username: user.username,
          role: "user"
        })
      );
      alert("Đăng nhập thành công!");
      navigate("/");
    } else {
      setError("Tên đăng nhập hoặc mật khẩu không đúng.");
    }
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const user = users.find((u: { username: string }) => u.username === resetUsername);

    if (user) {
      const tempPassword = Math.random().toString(36).slice(-8);
      
      const updatedUsers = users.map((u: { username: string; password: string }) => 
        u.username === resetUsername ? { ...u, password: tempPassword } : u
      );
      
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setResetMessage(`Mật khẩu tạm thời của bạn là: ${tempPassword}`);
    } else {
      setResetMessage("Không tìm thấy tên đăng nhập!");
    }
  };

  const ForgotPasswordModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-white">Reset Password</h2>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={resetUsername}
              onChange={(e) => setResetUsername(e.target.value)}
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>
          {resetMessage && (
            <p className={`text-sm ${resetMessage.includes('temporary') ? 'text-green-400' : 'text-red-400'}`}>
              {resetMessage}
            </p>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setResetMessage("");
                setResetUsername("");
              }}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-white"
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <Navigation />
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="mb-6 text-2xl font-bold text-center text-white">
          Đăng Nhập
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>} {/* Hiển thị lỗi */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Tên tài khoản
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())} // Bỏ khoảng trắng thừa
              className="w-full px-4 py-2 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên tài khoản"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-300"
            >
              Mật khẩu
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())} // Bỏ khoảng trắng thừa
              className="w-full px-4 py-2 text-sm text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập mật khẩu"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Đăng Nhập
          </button>
          
        </form>
        
        <button
          onClick={() => setShowForgotPassword(true)}
          className="mt-4 text-sm text-blue-400 hover:text-blue-300"
        >
          Quên mật khẩu?
        </button>
        <div className="flex justify-center">
          <p className="mt-4 text-sm text-gray-300">Bạn chưa có tài khoản?  </p>
          <Link to="/Register" className="mt-4 text-sm text-blue-400 hover:text-blue-300"> Đăng ký ngay</Link>
        </div>
      </div>
      {showForgotPassword && <ForgotPasswordModal />}
    </div>
  );
};

export default Login;
