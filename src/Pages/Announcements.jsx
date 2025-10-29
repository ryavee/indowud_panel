import React, { useState, useContext, useMemo } from "react";
import { Plus,Trash2, Notebook, Calendar, Flag, AlignLeft, MoreVertical } from 'lucide-react';
import Modal from "../Components/Reusable/form";
import AnnouncementForm from "../Components/announcement_form";
import { AnnouncementContext } from "../Context/AnnouncementContext";
import LoadingSpinner from "../Components/Reusable/LoadingSpinner";
import Pagination from "../Components/Reusable/Pagination";
import ConfirmationModal from "../Components/ConfirmationModal";

const Announcements = () => {
  const {
    announcements = [],
    createNewAnnouncement,
    deleteAnnouncement,
    loading,
    createLoading,
    deleteLoading,
  } = useContext(AnnouncementContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  // Pagination (client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [10, 25, 50];
  const totalPages = Math.max(1, Math.ceil((announcements?.length || 0) / pageSize));

  const paginatedAnnouncements = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return (announcements || []).slice(start, start + pageSize);
  }, [announcements, currentPage, pageSize]);

  // open add modal
  const handleHeaderAdd = () => {
    setSelectedAnnouncement(null);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      await createNewAnnouncement(formData);
      setIsModalOpen(false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Failed to create announcement:", error);
    }
  };

  const handleOpenEdit = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModalOpen(true);
  };

  const handleInitiateDelete = (announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedAnnouncement) return;
    try {
      await deleteAnnouncement(selectedAnnouncement.id);
      setIsDeleteModalOpen(false);
      setSelectedAnnouncement(null);
      // adjust page if we removed the last item on page
      if ((paginatedAnnouncements.length === 1) && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedAnnouncement(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAnnouncement(null);
  };

  if (loading) {
    return <LoadingSpinner centered message="Loading Announcements..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto">
        {/* Header: title + Add button */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
              <span>Announcements</span>
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded bg-[#00A9A3]/10 text-[#00A9A3] border border-[#00A9A3]/20">
                {announcements?.length || 0}
              </span>
            </h1>
            <p className="text-sm text-gray-600 mt-1">Manage announcements shown to users</p>
          </div>

          <div>
            <button
              onClick={handleHeaderAdd}
              className="inline-flex items-center gap-2 px-4 py-2 h-10 text-sm font-medium text-white bg-[#00A9A3] rounded-lg hover:bg-[#128083] shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Announcement
            </button>
          </div>
        </div>

        {/* Table container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {announcements.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No announcements found.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Notebook className="h-4 w-4" /> Title
                        </div>
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" /> Date
                        </div>
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <Flag className="h-4 w-4" /> Priority
                        </div>
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <AlignLeft className="h-4 w-4" /> Description
                        </div>
                      </th>

                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <div className="flex items-center gap-1">
                          <MoreVertical className="h-4 w-4" /> Action
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedAnnouncements.map((a) => (
                      <tr key={a.id || a._id || a.title} className="hover:bg-[#FFFAF3] transition-all">
                        {/* Title */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{a.title}</div>
                          <div className="text-xs text-gray-500 mt-1">{a.target || "All users"}</div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{a.date || "-"}</div>
                        </td>

                        {/* Priority */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700">{a.priority || "Normal"}</div>
                        </td>

                        {/* Description */}
                        <td className="px-6 py-4 whitespace-nowrap max-w-[36rem]">
                          <p className="text-sm text-gray-600 line-clamp-2">{a.message}</p>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              title="Delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInitiateDelete(a);
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 px-3 py-1.5 rounded-md transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
                            >
                              <Trash2 size={18} />                      
                              </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>

              {/* Pagination Component */}
             <div className="bg-gray-50 border-t border-gray-100">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  pageSize={pageSize}
                  onPageSizeChange={(size) => {
                    setPageSize(size);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedAnnouncement ? "Edit Announcement" : "Add New Announcement"}>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <AnnouncementForm
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
              loading={createLoading}
              initialData={selectedAnnouncement || undefined}
            />
          </div>
        </Modal>

        {/* Confirmation delete */}
        <ConfirmationModal
          isOpen={isDeleteModalOpen}
          title="Confirm Delete"
          message={
            selectedAnnouncement ? (
              <div>
                <p>Are you sure you want to delete the following announcement?</p>
                <div className="mt-3 bg-white p-3 rounded-md border border-gray-100 shadow-sm">
                  <h4 className="font-semibold text-gray-900">{selectedAnnouncement.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{selectedAnnouncement.message}</p>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Date: {selectedAnnouncement.date}</span>
                    <span>Priority: {selectedAnnouncement.priority}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-500">This action cannot be undone.</p>
              </div>
            ) : (
              "Are you sure you want to delete this announcement?"
            )
          }
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirming={deleteLoading}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmClassName="px-4 py-2 bg-[#E6004C] hover:bg-[#C00041] text-white rounded-md shadow-sm transition-colors disabled:opacity-50"
          cancelClassName="px-4 py-2 rounded-md text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
        />
      </div>
    </div>
  );
};

export default Announcements;
