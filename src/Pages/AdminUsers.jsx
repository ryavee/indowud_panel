import React, { useState, useEffect, useContext } from "react";
import { Loader2 } from "lucide-react";
import Modal from "../Components/Reusable/form";
import UserForm from "../Components/add_user_form";
import ConfirmationModal from "../Components/ConfirmationModal";
import { UserContext } from "../Context/userContext";
import { formatDateToDDMMYYYY } from "../utils/dateUtils";

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
      className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
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
  const [actionLoading, setActionLoading] = useState({
    edit: null,
    delete: null,
  });

  useEffect(() => {
    fetchUserList();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32"></div>
            <div className="h-9 bg-gray-200 rounded animate-pulse w-32"></div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading users...</p>
              </div>
            </div>
          </div>
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
    try {
      setEditingUser(user);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error preparing user edit:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, edit: null }));
    }
  };

  const handleDeleteUser = async (user) => {
    setActionLoading((prev) => ({ ...prev, delete: user.uid }));
    try {
      setIsConfirmationOpen(true);
      setUserToDelete(user);
    } catch (error) {
      console.error("Error preparing user deletion:", error);
    } finally {
      setActionLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await deleteUserFromPortal(userToDelete.uid);
    } catch (error) {
      console.error("Error deleting user:", error);
    } finally {
      setIsConfirmationOpen(false);
      setUserToDelete(null);
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            Users ({validUsers.length})
          </h3>
          <button
            onClick={handleAddUser}
            disabled={createOrUpdateUserLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {createOrUpdateUserLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <span className="text-lg">+</span>
            )}
            {createOrUpdateUserLoading ? "Adding..." : "Add New User"}
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {validUsers.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500">
              No users found.
            </div>
          ) : (
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
                    Joined On
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {validUsers.map((user) => (
                  <tr
                    key={user.uid}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {`${user.firstName || ""} ${
                            user.lastName || ""
                          }`.trim()}
                        </div>
                        <div
                          className={`text-sm text-gray-500 ${
                            !user.email ? "text-center" : ""
                          }`}
                        >
                          {user.email || "-"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm text-gray-900 ${
                          !user.phone ? "text-center" : ""
                        }`}
                      >
                        {user.phone || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RoleBadge role={user.role || "Unknown"} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge
                        status={
                          user.isUserInActive === true ? "Inactive" : "Active"
                        }
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div
                        className={`text-sm text-gray-900 ${
                          !user.createdAt ? "text-center" : ""
                        }`}
                      >
                        {user.createdAt
                          ? formatDateToDDMMYYYY(user.createdAt)
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          disabled={
                            actionLoading.edit === user.uid ||
                            createOrUpdateUserLoading
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {"Edit"}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          disabled={
                            actionLoading.delete === user.uid || deleteLoading
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs transition-colors disabled:bg-red-400 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {"Delete"}
                        </button>
                      </div>
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
            ? `Are you sure you want to delete "${userToDelete.firstName} ${userToDelete.lastName}"? This action cannot be undone.`
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
