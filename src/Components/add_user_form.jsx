import React, { useState } from "react";
import { getCurrentUserRole, ROLES } from "../utils/rbac";

// User Form Component
const UserForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    uid: initialData?.uid || "",
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    password: initialData?.password || "",
    role: initialData?.role || "Admin",
    isUserInActive: initialData?.isUserInActive || false,
    phone: initialData?.phone || "",
    createdAt: initialData?.createdAt || new Date().toISOString(),
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(""); // New state for API errors
  const currentUserRole = getCurrentUserRole();

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First name can only contain letters and spaces";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name can only contain letters and spaces";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    // Password validation (only for new users)
    if (!isEditing) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password =
          "Password must contain at least one uppercase letter, one lowercase letter, and one number";
      }
    }

    // Phone validation (optional but if provided, should be valid)
    if (formData.phone.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ""))) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    // Role validation - Updated to match the roles used in badges
    const validRoles = ["Super Admin", "Admin", "QR Generate"];
    if (!validRoles.includes(formData.role)) {
      newErrors.role = "Please select a valid role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    let newValue = value;

    // Handle status dropdown - convert to boolean for isUserInActive
    if (name === "status") {
      setFormData({
        ...formData,
        isUserInActive: value === "Inactive",
      });
    } else {
      setFormData({
        ...formData,
        [name]: newValue,
      });
    }

    // Clear field-specific errors
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }

    // Clear API error when user starts typing
    if (apiError) {
      setApiError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous API error
    setApiError("");

    if (validateForm()) {
      const cleanedData = {
        ...formData,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
      };

      // Call onSubmit and handle the response
      const result = await onSubmit(cleanedData);

      // If there's an error from the API, show it
      if (result && !result.success) {
        setApiError(result.error);
      }
    }
  };

  const isEditing = Boolean(initialData);

  return (
    <div className="space-y-4">
      {/* API Error Display */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{apiError}</p>
            </div>
          </div>
        </div>
      )}

      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          First Name *
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          disabled={isLoading}
          className={`w-full px-4 py-2 border rounded-lg text-gray-800 text-sm focus:ring-2 
            focus:ring-[#00A9A3]/50 focus:border-[#00A9A3] focus:outline-none shadow-sm transition-all
              placeholder:text-gray-400 disabled:bg-gray-100 
            disabled:cursor-not-allowed ${
              errors.firstName ? "border-red-500" : "border-gray-300"
            }`}
          placeholder="Enter first name"
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Last Name *
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          disabled={isLoading}
          className={`w-full px-4 py-2 border rounded-lg text-gray-800 text-sm focus:ring-2 
            focus:ring-[#00A9A3]/50 focus:border-[#00A9A3] focus:outline-none shadow-sm transition-all
              placeholder:text-gray-400 disabled:bg-gray-100 
            disabled:cursor-not-allowed ${
              errors.lastName ? "border-red-500" : "border-gray-300"
            }`}
          placeholder="Enter last name"
        />
        {errors.lastName && (
          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email *
          {isEditing && (
            <span className="text-xs text-gray-500 font-normal ml-2">
              (Cannot be changed)
            </span>
          )}
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading || isEditing} // Disable when editing
          className={`w-full px-4 py-2 border rounded-lg text-gray-800 text-sm focus:ring-2 
            focus:ring-[#00A9A3]/50 focus:border-[#00A9A3] focus:outline-none shadow-sm transition-all
              placeholder:text-gray-400 disabled:bg-gray-100 
            disabled:cursor-not-allowed ${
              isLoading || isEditing
                ? "bg-gray-50 text-gray-500 border-gray-200"
                : errors.email
                ? "border-red-500"
                : "border-gray-300"
            }`}
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
        {isEditing && (
          <p className="mt-1 text-xs text-gray-500">
            Email cannot be modified after user creation
          </p>
        )}
      </div>

      {/* Password - Only show when creating new user */}
      {!isEditing && (
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
            disabled={isLoading}
            className={`w-full px-4 py-2 border rounded-lg text-gray-800 text-sm focus:ring-2 
            focus:ring-[#00A9A3]/50 focus:border-[#00A9A3] focus:outline-none shadow-sm transition-all
              placeholder:text-gray-400 disabled:bg-gray-100 
            disabled:cursor-not-allowed
               ${errors.password ? "border-red-500" : "border-gray-300"}`}
            placeholder="Enter password"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>
      )}

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
          disabled={isLoading}
          className={`w-full px-4 py-2 border rounded-lg text-gray-800 text-sm focus:ring-2 
            focus:ring-[#00A9A3]/50 focus:border-[#00A9A3] focus:outline-none shadow-sm transition-all
              placeholder:text-gray-400 disabled:bg-gray-100 
            disabled:cursor-not-allowed
             ${errors.phone ? "border-red-500" : "border-gray-300"}`}
          placeholder="Enter phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
        )}
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
          disabled={isLoading}
          className={`w-full px-4 py-2 border rounded-lg text-gray-800 text-sm focus:ring-2 
            focus:ring-[#00A9A3]/50 focus:border-[#00A9A3] focus:outline-none shadow-sm transition-all
              placeholder:text-gray-400 disabled:bg-gray-100 
            disabled:cursor-not-allowed
            ${errors.role ? "border-red-500" : "border-gray-300"}`}
        >
          {currentUserRole === ROLES.SUPER_ADMIN ? (
            <>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin">Admin</option>
              <option value="QR Generate">QR Generate</option>
            </>
          ) : (
            <option value="QR Generate">QR Generate</option>
          )}
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role}</p>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Status *
        </label>
        <select
          name="status"
          value={formData.isUserInActive ? "Inactive" : "Active"}
          onChange={handleChange}
          disabled={isLoading}
          className={`w-full px-4 py-2 border rounded-lg text-gray-800 text-sm focus:ring-2 
            focus:ring-[#00A9A3]/50 focus:border-[#00A9A3] focus:outline-none shadow-sm transition-all
              placeholder:text-gray-400 disabled:bg-gray-100 
            disabled:cursor-not-allowed
            ${errors.status ? "border-red-500" : "border-gray-300"}`}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600">{errors.status}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100 mt-4">
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center cursor-pointer"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isEditing ? "Updating..." : "Creating..."}
            </>
          ) : (
            `${isEditing ? "Update" : "Create"} User`
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed 
          text-gray-700 py-2 px-4 rounded-md font-medium transition-colors cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserForm;
