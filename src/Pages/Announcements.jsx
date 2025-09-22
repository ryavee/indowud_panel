import React, { useState } from 'react';
import Modal from '../Components/Reusable/form';
import DataTable from '../Components/Reusable/table';
import AnnouncementForm from '../Components/announcement_form';

const Announcements = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: "System Maintenance", date: "2024-01-15", priority: "High", description: "Scheduled maintenance window" },
    { id: 2, title: "New Feature Release", date: "2024-01-14", priority: "Medium", description: "Exciting new features coming soon" },
    { id: 3, title: "Holiday Schedule", date: "2024-01-13", priority: "Low", description: "Updated holiday schedule" },
  ]);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Title", accessor: "title" },
    { header: "Date", accessor: "date" },
    { header: "Priority", accessor: "priority" },
  ];

  const handleFormSubmit = (formData) => {
    if (editingItem) {
      // Update existing
      setAnnouncements(announcements.map(item =>
        item.id === editingItem.id ? { ...item, ...formData } : item
      ));
    } else {
      // Create new
      const newId = announcements.length > 0
        ? Math.max(...announcements.map(a => a.id)) + 1
        : 1;
      setAnnouncements([...announcements, { id: newId, ...formData }]);
    }

    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleEdit = (row) => {
    setEditingItem(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete "${row.title}"?`)) {
      setAnnouncements(announcements.filter(item => item.id !== row.id));
    }
  };

  const handleHeaderAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <DataTable
          columns={columns}
          data={announcements}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onHeaderAdd={handleHeaderAdd}
          title="Announcements"
          emptyMessage="No announcements found"
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? "Edit Announcement" : "Add New Announcement"}
      >
        <AnnouncementForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseModal}
          initialData={editingItem}
        />
      </Modal>
    </div>
  );
};

export default Announcements;