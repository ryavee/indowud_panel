import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Upload,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { useFeedContext } from "../Context/FeedContext";
import { useAuthContext } from "../Context/AuthContext";

const Feed = () => {
  const { feeds, fetchFeeds, addFeed, editFeed, removeFeed, getFeedById } =
    useFeedContext();

  const { userData } = useAuthContext();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    feedId: null,
    feedTitle: "",
  });
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null, // Store the actual File object
    imagePreview: "", // For preview only
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageErrors, setImageErrors] = useState(new Set()); // Track failed images

  // Fetch feeds on component mount
  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when userData starts typing
    if (error) setError("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Store the file object and create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          imageFile: file, // Store the actual file
          imagePreview: e.target.result, // Store preview URL
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const openAddModal = () => {
    setFormData({
      title: "",
      description: "",
      imageFile: null,
      imagePreview: "",
    });
    setEditingId(null);
    setError("");
    setShowModal(true);
  };

  const openEditModal = (feed) => {
    setEditingId(feed.id);
    setFormData({
      title: feed.title,
      description: feed.description,
      imageFile: null, // Can't restore file object, only preview
      imagePreview: feed.image || "",
    });
    setError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required");
      return;
    }

    if (!userData.user.uid) {
      setError("userData authentication required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const feedData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        uid: userData.user.uid,
      };

      // Add imageFile if present
      if (formData.imageFile) {
        feedData.imageFile = formData.imageFile;
      }

      if (editingId) {
        // Update existing feed
        const result = await editFeed(editingId, feedData);
        if (result) {
          closeModal();
        } else {
          setError("Failed to update feed. Please try again.");
        }
      } else {
        // Add new feed
        const result = await addFeed(feedData);
        if (result) {
          closeModal();
        } else {
          setError("Failed to create feed. Please try again.");
        }
      }
    } catch (err) {
      console.error("Save error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      imageFile: null,
      imagePreview: "",
    });
    setError("");
    setLoading(false);
  };

  const openDeleteConfirm = (feed) => {
    setDeleteConfirm({
      show: true,
      feedId: feed.id,
      feedTitle: feed.title,
    });
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const success = await removeFeed(deleteConfirm.feedId);
      if (success) {
        closeDeleteConfirm();
      } else {
        // Handle delete failure
        console.error("Failed to delete feed");
      }
    } catch (err) {
      console.error("Error deleting feed:", err);
    } finally {
      setLoading(false);
    }
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ show: false, feedId: null, feedTitle: "" });
    setLoading(false);
  };

  const handleRefresh = () => {
    fetchFeeds();
    setImageErrors(new Set()); // Clear image errors on refresh
  };

  const getDefaultImage = () => {
    return "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=200&fit=crop";
  };

  // Handle image loading errors
  const handleImageError = (feedId) => {
    setImageErrors((prev) => new Set(prev).add(feedId));
  };

  // Check if feed has a valid image
  const hasValidImage = (feed) => {
    return feed.image && feed.image.trim() !== "" && !imageErrors.has(feed.id);
  };

  // Render image or placeholder
  const renderFeedImage = (feed) => {
    if (hasValidImage(feed)) {
      return (
        <img
          src={feed.image}
          alt={feed.title || "Feed image"}
          className="w-24 h-16 object-cover rounded-md flex-shrink-0"
          onError={() => handleImageError(feed.id)}
          loading="lazy"
        />
      );
    } else {
      // Show placeholder when no image or image failed to load
      return (
        <div className="w-24 h-16 bg-gray-100 rounded-md flex-shrink-0 flex items-center justify-center border border-gray-200">
          <ImageIcon size={20} className="text-gray-400" />
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feeds</h1>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            title="Refresh feeds"
          >
            <RefreshCw size={20} />
            Refresh
          </button>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add New Feed
          </button>
        </div>
      </div>

      {/* Feeds List */}
      <div className="space-y-4">
        {feeds.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="mb-4">
              <Plus size={48} className="mx-auto text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No feeds yet
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first feed to get started!
            </p>
            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2 transition-colors"
            >
              <Plus size={20} />
              Create Feed
            </button>
          </div>
        ) : (
          // Enhanced feeds mapping with better null checks and image handling
          feeds
            .filter((feed) => feed !== null && feed !== undefined)
            .map((feed) => (
              <div
                key={feed.id}
                className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Enhanced image rendering with placeholder */}
                  {renderFeedImage(feed)}

                  <div className="flex-1 min-w-0">
                    {" "}
                    {/* min-w-0 prevents flex item overflow */}
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate">
                      {feed.title || "Untitled Feed"}
                    </h3>
                    <p className="text-gray-600 mb-3 line-clamp-2 break-words">
                      {feed.description || "No description available"}
                    </p>
                    {/* Show image status if needed */}
                    {!hasValidImage(feed) && feed.image && (
                      <p className="text-xs text-amber-600 mb-2 flex items-center gap-1">
                        <AlertCircle size={12} />
                        Image not available
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(feed)}
                        className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50 flex items-center gap-1 text-sm transition-colors"
                      >
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(feed)}
                        className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50 flex items-center gap-1 text-sm transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingId ? "Edit Feed" : "Add New Feed"}
                </h3>
                <button
                  onClick={closeModal}
                  disabled={loading}
                  className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
                  <AlertCircle size={16} />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter feed title"
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter feed description"
                    rows="3"
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {formData.description.length}/500
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image{" "}
                    <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={loading}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className={`w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md cursor-pointer flex items-center justify-center gap-2 transition-colors border-2 border-dashed border-gray-300 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <Upload size={16} />
                      {formData.imagePreview ? "Change Image" : "Upload Image"}
                    </label>

                    {formData.imagePreview ? (
                      <div className="mt-2">
                        <img
                          src={formData.imagePreview}
                          alt="Preview"
                          className="w-full h-32 object-cover rounded-md border"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              imageFile: null,
                              imagePreview: "",
                            }))
                          }
                          className="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                          disabled={loading}
                        >
                          <X size={12} />
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ImageIcon size={16} className="text-gray-400" />
                          <span>
                            No image selected - a placeholder will be used
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={
                      loading ||
                      !formData.title.trim() ||
                      !formData.description.trim()
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <RefreshCw size={16} className="animate-spin" />
                    ) : (
                      <Save size={16} />
                    )}
                    {loading
                      ? editingId
                        ? "Updating..."
                        : "Adding..."
                      : editingId
                      ? "Update Feed"
                      : "Add Feed"}
                  </button>
                  <button
                    onClick={closeModal}
                    disabled={loading}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={20} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Delete Feed
                  </h3>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "
                <strong>{deleteConfirm.feedTitle}</strong>"? This action cannot
                be undone.
              </p>

              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-md transition-colors disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading && <RefreshCw size={16} className="animate-spin" />}
                  {loading ? "Deleting..." : "Delete"}
                </button>
                <button
                  onClick={closeDeleteConfirm}
                  disabled={loading}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:opacity-50 text-white px-4 py-2 rounded-md transition-colors disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;
