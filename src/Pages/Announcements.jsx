import React, { useState, useContext } from "react";
import Modal from "../Components/Reusable/form";
import DataTable from "../Components/Reusable/table";
import AnnouncementForm from "../Components/announcement_form";
import { AnnouncementContext } from "../Context/AnnouncementContext";

const Announcements = () => {
  const {
    announcements,
    createNewAnnouncement,
    deleteAnnouncement,
    loading,
    createLoading,
    deleteLoading,
  } = useContext(AnnouncementContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Date", accessor: "date" },
    { header: "Priority", accessor: "priority" },
    { header: "Description", accessor: "message" },
  ];

  const handleFormSubmit = async (formData) => {
    try {
      await createNewAnnouncement(formData);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to create announcement:", error);
      // You might want to show an error message to the user here
    }
  };

  const handleDelete = (row) => {
    setSelectedAnnouncement(row);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedAnnouncement) {
      try {
        await deleteAnnouncement(selectedAnnouncement.id);
        setIsDeleteModalOpen(false);
        setSelectedAnnouncement(null);
      } catch (error) {
        console.error("Failed to delete announcement:", error);
        // You might want to show an error message to the user here
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleHeaderAdd = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DataTable
        columns={columns}
        data={announcements}
        onDelete={handleDelete}
        onHeaderAdd={handleHeaderAdd}
        title="Announcements"
        emptyMessage="No announcements found"
        showEdit={false}
        loading={loading}
        deleteDisabled={deleteLoading}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Add New Announcement"
      >
        <AnnouncementForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          loading={createLoading}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Confirm Delete"
      >
        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-700 mb-2">
              Are you sure you want to delete this announcement?
            </p>
            {selectedAnnouncement && (
              <div className="bg-gray-100 p-3 rounded-lg">
                <h4 className="font-semibold text-gray-800">
                  {selectedAnnouncement.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedAnnouncement.message}
                </p>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Date: {selectedAnnouncement.date}</span>
                  <span>Priority: {selectedAnnouncement.priority}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancelDelete}
              className="px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={deleteLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {deleteLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                  Deleting...
                </span>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Announcements;
