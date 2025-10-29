import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Loader,
  Plus,
  Search,
  User,
  Phone,
  Shield,
  CheckCircle,
  Calendar,
  MoreVertical,
} from "lucide-react";
import Modal from "../Components/Reusable/form";
import UserForm from "../Components/add_user_form";
import ConfirmationModal from "../Components/ConfirmationModal";
import { UserContext } from "../Context/userContext";
import { formatDateToDDMMYYYY } from "../utils/dateUtils";
import ActionButtons from "../Components/Reusable/ActionButtons";
import ExportButton from "../Components/export_button";
import ImportCSVButton from "../Components/Import_button";
import LoadingSpinner from "../Components/Reusable/LoadingSpinner";


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
      case "Admin":
        return "bg-blue-100 text-blue-800";
      case "QR Generate":
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
    uploadUserFile,
  } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState({
    edit: null,
    delete: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    fetchUserList();
  }, []);

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

  const exportColumns = [
    { header: "First Name", key: "firstName" },
    { header: "Last Name", key: "lastName" },
    { header: "Email", key: "email" },
    { header: "Password", key: "password" },
    { header: "Phone", key: "phone" },
    { header: "Role", key: "role" },
    {
      header: "Status",
      key: "isUserInActive",
      formatter: (value) => (value ? "Inactive" : "Active"),
    },
    {
      header: "Joined On",
      key: "createdAt",
      formatter: (value) => (value ? formatDateToDDMMYYYY(value) : ""),
    },
  ];




  if (loading) {
    return <LoadingSpinner centered message="Loading Users..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Admin Users
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage admin accounts, roles, and access controls within your
            system.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="QR Generate">QR Generate</option>
          </select>

          <div className="flex item-center gap-2">
            <ImportCSVButton
              requiredHeaders={exportColumns}
              onUpload={uploadUserFile}
              label="Import Users"
            />
            <ExportButton
              data={filteredUsers}
              columns={exportColumns}
              filename="admin-users"
              disabled={false}
            />

            <button
              onClick={handleAddUser}
              disabled={createOrUpdateUserLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
                          text-white bg-[#00A9A3] rounded-lg hover:bg-[#128083] 
                          shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              {createOrUpdateUserLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500 mb-4">No users found</p>
              <button
                onClick={handleAddUser}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm cursor-pointer"
              >
                Add First User
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    {[
                      ["User", User],
                      ["Contact", Phone],
                      ["Role", Shield],
                      ["Status", CheckCircle],
                      ["Joined On", Calendar],
                      ["Action", MoreVertical],
                    ].map(([label, Icon]) => (
                      <th
                        key={label}
                        className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                      >
                        <div className="flex items-center gap-1">
                          <Icon className="h-4 w-4 text-gray-500" /> {label}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.uid}
                      className="hover:bg-orange-50/40 transition-all"
                    >
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {`${user.firstName} ${user.lastName}`}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.email || "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.phone || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <RoleBadge role={user.role || "Unknown"} />
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge
                          status={user.isUserInActive ? "Inactive" : "Active"}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {user.createdAt
                          ? formatDateToDDMMYYYY(user.createdAt)
                          : "-"}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <ActionButtons
                          onEdit={() => handleEditUser(user)}
                          onDelete={() => handleDeleteUser(user)}
                          loadingEdit={
                            actionLoading.edit === user.uid ||
                            createOrUpdateUserLoading
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
            </div>
          )}
        </div>
      </div>

      {/* Modals */} 
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

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        title="Delete Admin User"
        message={
          userToDelete ? (
            <span>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-[#169698]">
                {userToDelete.firstName} {userToDelete.lastName}
              </span>{" "}
              (
              <span className="text-orange-600 font-medium">
                {userToDelete.email || "no email"}
              </span>
              )? <br />
              <span className="text-gray-600">
                This action cannot be undone.
              </span>
            </span>
          ) : (
            ""
          )
        }
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLoading}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default AdminUsers;
