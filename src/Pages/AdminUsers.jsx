import React, { useState, useEffect, useContext } from "react";
import { Loader2, Search, User, Phone, Shield, CheckCircle, Calendar, MoreVertical } from "lucide-react";
import Modal from "../Components/Reusable/form";
import UserForm from "../Components/add_user_form";
import ConfirmationModal from "../Components/ConfirmationModal";
import { UserContext } from "../Context/userContext";
import { formatDateToDDMMYYYY } from "../utils/dateUtils";
import ActionButtons from "../Components/Reusable/ActionButtons";

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
        status
      )}`}
    >
      {status}
    </span>
  );
};

const RoleBadge = ({ role }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case "SuperAdmin":
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
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${getRoleColor(
        role
      )}`}
    >
      {role}
    </span>
  );
};

const AdminUsers = () => {
  const {
    usersList,
    loading,
    createOrUpdateUserLoading,
    deleteLoading,
    fetchUserList,
    createUserAdminPortal,
    updateUserData,
    deleteUserFromPortal,
  } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState({ edit: null, delete: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    fetchUserList();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  const handleFormSubmit = async (formData) => {
    if (editingUser) {
      const result = await updateUserData(formData);
      if (result.success) {
        setIsModalOpen(false);
        setEditingUser(null);
      }
      return result;
    } else {
      const result = await createUserAdminPortal(formData);
      if (result.success) {
        setIsModalOpen(false);
        setEditingUser(null);
      }
      return result;
    }
  };

  const handleEditUser = async (user) => {
    setActionLoading((prev) => ({ ...prev, edit: user.uid }));
    setEditingUser(user);
    setIsModalOpen(true);
    setActionLoading((prev) => ({ ...prev, edit: null }));
  };

  const handleDeleteUser = (user) => {
    setIsConfirmationOpen(true);
    setUserToDelete(user);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    await deleteUserFromPortal(userToDelete.uid);
    setIsConfirmationOpen(false);
    setUserToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsConfirmationOpen(false);
    setUserToDelete(null);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const validUsers = (usersList || []).filter(
    (user) => user && user.uid && user.firstName && user.lastName
  );

  const filteredUsers = validUsers.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
      {/* Page Header */}
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-600">
            Manage admins, assign roles, and control access to the system.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="All">All Roles</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
            <option value="Factory User">Factory User</option>
          </select>

          {/* Add User */}
          <button
            onClick={handleAddUser}
            disabled={createOrUpdateUserLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {createOrUpdateUserLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="text-lg">+</span>
            )}
            {createOrUpdateUserLoading ? "Adding..." : "Add User"}
          </button>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-3">No users found.</p>
              <button
                onClick={handleAddUser}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
              >
                Add First User
              </button>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" /> User
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" /> Contact
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" /> Role
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" /> status
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" /> Joined on
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <MoreVertical className="h-4 w-4" /> Action
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 odd:bg-white even:bg-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {`${user.firstName} ${user.lastName}`}
                      </div>
                      <div className="text-sm text-gray-500">{user.email || "-"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phone || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role || "Unknown"} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={user.isUserInActive ? "Inactive" : "Active"}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.createdAt
                        ? formatDateToDDMMYYYY(user.createdAt)
                        : "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <ActionButtons
                        onEdit={() => handleEditUser(user)}
                        onDelete={() => handleDeleteUser(user)}
                        loadingEdit={
                          actionLoading.edit === user.uid || createOrUpdateUserLoading
                        }
                        loadingDelete={
                          actionLoading.delete === user.uid || deleteLoading
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? "Edit Admin User" : "Add New Admin User"}
      >
        <UserForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          initialData={editingUser}
          isLoading={createOrUpdateUserLoading}
        />
      </Modal>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={
          userToDelete
            ? `Are you sure you want to delete "${userToDelete.firstName} ${userToDelete.lastName}"?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default AdminUsers;
