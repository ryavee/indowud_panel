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
  Lock,
  ChevronUp,
  ChevronDown,
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
import { getCurrentUser, getCurrentUserRole, ROLES } from "../utils/rbac";

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
      case "Super Admin":
        return "bg-red-100 text-red-800";
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
  const currentUser = getCurrentUser();
  const currentUserRole = getCurrentUserRole();

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
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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

  const sortedUsers = React.useMemo(() => {
    let sortableUsers = [...filteredUsers];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'firstName') {
          aValue = `${a.firstName || ''} ${a.lastName || ''}`.toLowerCase();
          bValue = `${b.firstName || ''} ${b.lastName || ''}`.toLowerCase();
        } else if (sortConfig.key === 'isUserInActive') {
          aValue = a.isUserInActive ? 1 : 0;
          bValue = b.isUserInActive ? 1 : 0;
        } else {
          if (typeof aValue === 'string') aValue = aValue.toLowerCase();
          if (typeof bValue === 'string') bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableUsers;
  }, [filteredUsers, sortConfig]);

  const requestSort = (key) => {
    if (!key) return;
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

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
  const canEditOrDelete = (targetUser) => {
    if (
      currentUserRole === ROLES.ADMIN &&
      targetUser.role === ROLES.SUPER_ADMIN
    )
      return false;
    if (currentUserRole === ROLES.ADMIN && currentUser?.uid === targetUser.uid)
      return false;

    if (currentUserRole === ROLES.ADMIN && targetUser.role === ROLES.ADMIN)
      return false;

    if (currentUser?.uid === targetUser.uid) return false;

    return true;
  };

  return (

    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="w-full max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Admin Users
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage admin accounts, roles, and access controls within your
            system.
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 mb-8 justify-between">

          {/* Left side: Filters */}
          <div className="flex flex-wrap items-center gap-3">

            {/* Search */}
            <div className="relative min-w-[260px] sm:min-w-[300px] md:w-72 lg:w-80 flex-1">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm shadow-sm transition-all"


              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 cursor-pointer shadow-sm"
            >
              <option value="All">All Roles</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="QR Generate">QR Generate</option>
            </select>
          </div>


          {/* Right side – Buttons*/}
          <div className="flex flex-wrap items-center gap-3 mt-2 sm:mt-0">

            <div className="flex item-center gap-2">
              {currentUserRole === ROLES.SUPER_ADMIN && (
                <>
                  <ImportCSVButton
                    requiredHeaders={exportColumns}
                    onUpload={uploadUserFile}
                    label="Import Users"
                  />
                  <ExportButton
                    data={sortedUsers}
                    columns={exportColumns}
                    filename="admin-users"
                    disabled={false}
                  />
                </>
              )}

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
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {sortedUsers.length === 0 ? (
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
                      { label: "User", Icon: User, sortKey: "firstName" },
                      { label: "Contact", Icon: Phone, sortKey: "phone" },
                      { label: "Role", Icon: Shield, sortKey: "role" },
                      { label: "Status", Icon: CheckCircle, sortKey: "isUserInActive" },
                      { label: "Joined On", Icon: Calendar, sortKey: "createdAt" },
                      { label: "Action", Icon: MoreVertical, sortKey: null },
                    ].map(({ label, Icon, sortKey }) => (
                      <th
                        key={label}
                        className={`px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider outline-none focus:outline-none focus-visible:outline-none ${sortKey ? "cursor-pointer select-none hover:bg-gray-200 transition-colors group" : ""}`}
                        onClick={() => requestSort(sortKey)}
                      >
                        <div className="flex items-center gap-1 whitespace-nowrap">
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span>{label}</span>
                          {sortKey && (
                            <div className="w-4 h-4 flex items-center justify-center">
                              {sortConfig.key === sortKey ? (
                                sortConfig.direction === 'asc' ?
                                  <ChevronUp className="h-4 w-4 text-gray-700" /> :
                                  <ChevronDown className="h-4 w-4 text-gray-700" />
                              ) : (
                                <div className="w-4 h-4" />
                              )}
                            </div>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {sortedUsers.map((user) => (
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
                        {canEditOrDelete(user) ? (
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
                        ) : (
                          <div
                            className="flex items-center gap-2 px-2 py-1 rounded-md text-gray-400  cursor-not-allowed select-none
                transition-all duration-200"
                          >
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-200">
                              <Lock className="w-3.5 h-3.5 text-gray-500" />
                            </div>
                            <span className="text-xs font-medium">Locked</span>
                          </div>
                        )}
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
