import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  username: string;
  email: string;
  role: string;
  password: string;
  id?: number;
}

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(storedUsers.map((user: User, index: number) => ({ ...user, id: index + 1 })));
  }, []);

  const handleDelete = (email: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      const updatedUsers = users.filter(user => user.email !== email);
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUsers = users.map(user =>
      user.email === editingUser.email ? editingUser : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setShowEditModal(false);
    setEditingUser(null);
  };

  // Edit Modal Component
  const EditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Chỉnh sửa người dùng</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={editingUser?.username || ''}
              onChange={e => setEditingUser(prev => prev ? { ...prev, username: e.target.value } : null)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={editingUser?.email || ''}
              onChange={e => setEditingUser(prev => prev ? { ...prev, email: e.target.value } : null)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={editingUser?.password || ''}
                onChange={e => setEditingUser(prev => prev ? { ...prev, password: e.target.value } : null)}
                className="flex-1 p-2 rounded bg-gray-700 text-white"
                placeholder="Leave blank to keep current"
              />
              <button
                type="button"
                onClick={() => {
                  const tempPass = Math.random().toString(36).slice(-8);
                  setEditingUser(prev => prev ? { ...prev, password: tempPass } : null);
                }}
                className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                title="Generate random password"
              >
                🎲
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              value={editingUser?.role || 'user'}
              onChange={e => setEditingUser(prev => prev ? { ...prev, role: e.target.value } : null)}
              className="w-full p-2 rounded bg-gray-700 text-white"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Xóa thông tin người dùng
    alert("Đăng xuất thành công!");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 flex flex-col">
        <div className="p-4 text-center text-xl font-bold bg-gray-700">
          Quản lý người dùng
        </div>
        <nav className="flex-1 p-4 space-y-4">

          <button className="block w-full text-left px-4 py-2 rounded hover:bg-gray-700" onClick={() => navigate("/movieManager")} >
            Quản lý phim
          </button>

        </nav>
        <button
          onClick={handleLogout}
          className="p-4 text-center bg-red-600 hover:bg-red-700"
        >
          Đăng xuất
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Trang quản lý người dùng</h1>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              A
            </div>
            <span>Admin</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Thống kê nhanh */}
            <div className="p-4 bg-gray-800 rounded shadow">
              <h2 className="text-lg font-semibold">Người dùng</h2>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="p-4 bg-gray-800 rounded shadow">
              <h2 className="text-lg font-semibold">Phim</h2>
              <p className="text-2xl font-bold">23127</p>
            </div>
            <div className="p-4 bg-gray-800 rounded shadow">
              <h2 className="text-lg font-semibold">Lượt xem</h2>
              <p className="text-2xl font-bold">873,234</p>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="mt-6 bg-gray-800 p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Danh sách người dùng</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">Tên</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.email} className="border-b border-gray-700">
                    <td className="px-4 py-2">{user.id}</td>
                    <td className="px-4 py-2">{user.username}</td>
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.role}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="px-2 py-1 text-sm bg-blue-600 rounded hover:bg-blue-700"
                        title="Edit user details and password"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => {
                          const tempPass = Math.random().toString(36).slice(-8);
                          const updatedUsers = users.map(u =>
                            u.email === user.email ? { ...u, password: tempPass } : u
                          );
                          localStorage.setItem("users", JSON.stringify(updatedUsers));
                          setUsers(updatedUsers);
                          alert(`New password for ${user.username}: ${tempPass}`);
                        }}
                        className="ml-2 px-2 py-1 text-sm bg-green-600 rounded hover:bg-green-700"
                        title="Reset password"
                      >
                        🔑
                      </button>
                      <button
                        onClick={() => handleDelete(user.email)}
                        className="ml-2 px-2 py-1 text-sm bg-red-600 rounded hover:bg-red-700"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && <EditModal />}
    </div>
  );
};

export default AdminDashboard;
