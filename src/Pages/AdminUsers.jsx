import React, { useState } from "react";

// Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Transparent Backdrop with inline styles and small blur */}
      <div
        className="fixed inset-0 z-40"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.05)",
          backdropFilter: "blur(2px)",
          WebkitBackdropFilter: "blur(2px)",
        }}
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ pointerEvents: "none" }}
      >
        <div
          className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border-2 border-gray-400"
          style={{ pointerEvents: "auto" }}
        >
          {/* Modal Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-colors"
            >
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 bg-white">{children}</div>
        </div>
      </div>
    </>
  );
};

// User Form Component
const UserForm = ({ onSubmit, onCancel, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    email: initialData?.email || "",
    password: initialData?.password || "",
    role: initialData?.role || "Admin",
    status: initialData?.status || "Active",
    phone: initialData?.phone || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter full name"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter email address"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={
            initialData
              ? "Leave blank to keep current password"
              : "Enter password"
          }
        />
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter phone number"
        />
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Role *
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Super Admin">Super Admin</option>
          <option value="Admin">Admin</option>
          <option value="Factory User">Factory User</option>
        </select>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
        >
          {initialData ? "Update" : "Create"} User
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

// Role Badge Component
const RoleBadge = ({ role }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-100 text-purple-800";
      case "Admin":
        return "bg-blue-100 text-blue-800";
      case "Factory User":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
        role
      )}`}
    >
      {role}
    </span>
  );
};

// Main AdminUsers Component
const AdminUsers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      password: "password123",
      phone: "+1 (555) 123-4567",
      role: "Super Admin",
      status: "Active",
      lastLogin: "2024-01-15",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.johnson@company.com",
      password: "password123",
      phone: "+1 (555) 234-5678",
      role: "Admin",
      status: "Active",
      lastLogin: "2024-01-14",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@company.com",
      password: "password123",
      phone: "+1 (555) 345-6789",
      role: "Factory User",
      status: "Inactive",
      lastLogin: "2024-01-10",
    },
    {
      id: 4,
      name: "Emily Brown",
      email: "emily.brown@company.com",
      password: "password123",
      phone: "+1 (555) 456-7890",
      role: "Factory User",
      status: "Active",
      lastLogin: "2024-01-13",
    },
    {
      id: 5,
      name: "David Wilson",
      email: "david.wilson@company.com",
      password: "password123",
      phone: "+1 (555) 567-8901",
      role: "Admin",
      status: "Inactive",
      lastLogin: "2024-01-05",
    },
  ]);

  const handleFormSubmit = (formData) => {
    if (editingUser) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
    } else {
      // Create new user
      const newId =
        users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      setUsers([
        ...users,
        {
          id: newId,
          ...formData,
          lastLogin: new Date().toISOString().split("T")[0],
        },
      ]);
    }

    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user) => {
    if (window.confirm(`Are you sure you want to delete "${user.name}"?`)) {
      setUsers(users.filter((u) => u.id !== user.id));
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              Admin Users ({users.length})
            </h3>
            <button
              onClick={handleAddUser}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <span className="text-lg">+</span>
              Add New User
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.lastLogin}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={editingUser ? "Edit Admin User" : "Add New Admin User"}
        >
          <UserForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialData={editingUser}
          />
        </Modal>
      </div>
    </div>
  );
};

export default AdminUsers;
