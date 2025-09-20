import React, { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../Context/SettingsContext";
import { FaTimes, FaEnvelope, FaCoins } from "react-icons/fa";

const Settings = () => {
  const { settings, loading, updateUserLoading, error, updateUserList } =
    useContext(SettingsContext);
  const [newEmail, setNewEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [redemptionLimit, setRedemptionLimit] = useState("");
  const [coinValue, setCoinValue] = useState("");

  useEffect(() => {
    if (settings) {
      setEmails(settings.requestTo || []);
      setRedemptionLimit(settings.redemptionLimit || "");
      setCoinValue(settings.ratio || "");
    }
  }, [settings]);

  const handleAddEmail = async () => {
    if (newEmail && !emails.includes(newEmail)) {
      const updatedEmails = [...emails, newEmail];
      setEmails(updatedEmails);
      setNewEmail("");

      const updateUserListData = {
        requestTo: updatedEmails,
      };

      try {
        await updateUserList(updateUserListData);
      } catch (err) {
        setEmails(emails);
        setNewEmail(newEmail);
        alert("Failed to add email. Please try again.");
      }
    }
  };

  const handleRemoveEmail = async (emailToRemove) => {
    const updatedEmails = emails.filter((email) => email !== emailToRemove);
    setEmails(updatedEmails);

    const updateUserListData = {
      requestTo: updatedEmails,
    };

    try {
      await updateUserList(updateUserListData);
    } catch (err) {
      setEmails(emails);
      alert("Failed to remove email. Please try again.");
    }
  };

  const handleSaveEmails = async () => {
    const updateUserListData = {
      requestTo: emails,
    };

    try {
      await updateUserList(updateUserListData);
    } catch (err) {
      alert("Failed to save settings. Check console.");
    }
  };

  const handleSave = () => {
    saveSettings({
      requestTo: emails,
      redemptionLimit,
      ratio: coinValue,
    });
  };

  if (loading) return <p className="p-4 text-blue-600">Loading settings...</p>;
  if (error) return <p className="p-4 text-red-600">Error: {error}</p>;

  return (
    <div className="px-6 pb-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto pt-0">
        <h1 className="text-2xl font-bold text-gray-900">
          Redemption Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your redemption preferences and system values.
        </p>

        {/* Emails Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <FaEnvelope className="text-blue-600" size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Redemption Receipt Management
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Add or remove users who receive redemption request emails.
              </p>
            </div>
          </div>

          <div className="flex items-center mt-4 space-x-2">
            <input
              type="email"
              placeholder="user@example.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={updateUserLoading}
              className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleAddEmail}
              disabled={updateUserLoading || !newEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
            >
              {updateUserLoading ? (
                <>
                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Adding...</span>
                </>
              ) : (
                <span>+ Add</span>
              )}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {emails.map((email, index) => (
              <div
                key={index}
                className="flex items-center space-x-1 bg-gray-200 text-gray-700 rounded-full pl-3 pr-1 py-1 text-xs font-medium"
              >
                <span>{email}</span>
                <button
                  onClick={() => handleRemoveEmail(email)}
                  disabled={updateUserLoading}
                  className="p-1 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {<FaTimes size={10} />}
                </button>
              </div>
            ))}
          </div>

          {updateUserLoading && (
            <div className="flex items-center justify-center mt-4 p-2 bg-blue-50 rounded-md">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-blue-600 text-sm">
                Updating email list...
              </span>
            </div>
          )}
        </div>

        {/* Limits Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mt-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-full">
              <FaCoins className="text-green-600" size={18} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                Redemption Limit & Coin Value
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Manage the limits and value for coin redemptions.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Redemption Limit
              </label>
              <input
                type="text"
                value={redemptionLimit}
                onChange={(e) => setRedemptionLimit(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coin Value
              </label>
              <input
                type="text"
                value={coinValue}
                onChange={(e) => setCoinValue(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
              />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
