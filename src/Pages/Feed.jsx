import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  Upload,
  AlertCircle,
  Loader,
  Image as ImageIcon,
} from "lucide-react";
import { useFeedContext } from "../Context/FeedContext";
import { useAuthContext } from "../Context/AuthContext";
import ActionButtons from "../Components/Reusable/ActionButtons";
import LoadingSpinner from "../Components/Reusable/LoadingSpinner";
import ConfirmationModal from "../Components/ConfirmationModal";

const Feed = () => {
  const { feeds, fetchFeeds, addFeed, editFeed, removeFeed } = useFeedContext();
  const { userData } = useAuthContext();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null,
    imagePreview: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState(new Set());

  // delete confirmation
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Fetch feeds initially
  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) =>
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: ev.target.result,
      }));
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", description: "", imageFile: null, imagePreview: "" });
    setError("");
    setShowModal(true);
  };

  const openEditModal = (feed) => {
    setEditingId(feed.id);
    setFormData({
      title: feed.title,
      description: feed.description,
      imageFile: null,
      imagePreview: feed.image || "",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return setError("Title is required");
    if (!formData.description.trim()) return setError("Description is required");
    if (!userData?.user?.uid) return setError("User authentication required");

    setLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        uid: userData.user.uid,
      };
      if (formData.imageFile) payload.imageFile = formData.imageFile;

      // add createdAt timestamp for new feeds
      if (!editingId) {
        payload.createdAt = new Date().toISOString();
      }

      console.log("Creating feed payload:", payload);

      const success = editingId
        ? await editFeed(editingId, payload)
        : await addFeed(payload);

      if (success) setShowModal(false);
      else setError("Failed to save feed. Please try again.");
    } catch (err) {
      console.error("Save error:", err);
      setError("An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setLoading(true);
    try {
      await removeFeed(deleteTarget.id);
    } finally {
      setLoading(false);
      setConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const openDeleteConfirm = (feed) => {
    setDeleteTarget(feed);
    setConfirmOpen(true);
  };


  const handleImageError = (id) => {
    setImageErrors((prev) => new Set(prev).add(id));
  };

  const hasValidImage = (feed) =>
    feed.image && feed.image.trim() !== "" && !imageErrors.has(feed.id);

  if (loading) {
    return <LoadingSpinner centered message="Loading feeds..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Feeds</h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage your company updates, offers, and posts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold 
                          text-white bg-[#00A9A3] rounded-lg hover:bg-[#128083] 
                          shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Feed
          </button>
        </div>
      </div>

      {/* Feeds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {(!feeds || feeds.length === 0) ? (
          <div className="col-span-full flex flex-col items-center justify-center text-center py-12 text-gray-500 bg-white border border-gray-100 rounded-lg shadow-sm">
            <div className="mb-4">
              <Plus size={40} className="mx-auto text-gray-300" />
            </div>

            <h3 className="text-base font-medium text-gray-900 mb-1">No feeds yet</h3>
            <p className="text-gray-500 mb-4 text-sm">Create your first feed to get started!</p>

            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold 
              text-white bg-[#00A9A3] rounded-lg hover:bg-[#128083] 
              shadow-sm hover:shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Feed
            </button>
          </div>

        ) : (
          feeds.map((feed) => (
            <div
              key={feed.id}
              className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:scale-[1.01]"
            >
              {/* Image */}
              <div className="relative w-full h-28 overflow-hidden">
                {hasValidImage(feed) ? (
                  <img
                    src={feed.image}
                    alt={feed.title || "Feed image"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => handleImageError(feed.id)}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center border-b border-gray-200">
                    <ImageIcon size={22} className="text-gray-400" />
                  </div>
                )}

                {/* Overlay Label */}
                <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-md text-[10px] font-medium text-gray-700 px-2 py-[2px] rounded-full shadow-sm">
                  FEED
                </div>
              </div>

              {/* Content */}
              <div className="p-3 flex flex-col justify-between min-h-[100px]">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                    {feed.title || "Untitled Feed"}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {feed.description || "No description available"}
                  </p>
                  {!hasValidImage(feed) && feed.image && (
                    <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle size={10} />
                      Image not available
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-gray-400 truncate">
                    {feed.createdAt
                      ? `Created: ${new Date(feed.createdAt).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}`
                      : ""}
                  </span>

                  <ActionButtons
                    onEdit={() => openEditModal(feed)}
                    onDelete={() => openDeleteConfirm(feed)}
                    loadingEdit={loading && editingId === feed.id}
                    loadingDelete={loading && deleteTarget?.id === feed.id}
                    disableAll={loading}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 border border-gray-100 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Feed" : "Add New Feed"}
            </h3>

            {error && (
              <div className="mb-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 p-3 rounded-md">
                <AlertCircle size={16} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#00A9A3]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  disabled={loading}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#00A9A3]"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={loading}
                    id="feed-image"
                    className="hidden"
                  />
                  <label
                    htmlFor="feed-image"
                    className="border-2 border-dashed border-gray-200 w-full flex justify-center items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md py-2 cursor-pointer"
                  >
                    <Upload size={16} />{" "}
                    {formData.imagePreview ? "Change Image" : "Upload Image"}
                  </label>

                  {formData.imagePreview && (
                    <div className="mt-2">
                      <img
                        src={formData.imagePreview}
                        alt="Preview"
                        className="w-full h-40 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            imageFile: null,
                            imagePreview: "",
                          })
                        }
                        className="mt-2 text-sm text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
                      >
                        <X size={12} /> Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 bg-[#00A9A3] hover:bg-[#128083] text-white rounded-md flex items-center gap-2
                            cursor-pointer"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {editingId ? "Update Feed" : "Save Feed"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={confirmOpen}
        title="Delete Feed"
        message={`Are you sure you want to delete "${deleteTarget?.title || "this feed"
          }"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setDeleteTarget(null);
        }}
        isLoading={loading}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Feed;
