import React, { useState } from 'react';
import { FaTimes, FaEnvelope, FaCoins, FaMoneyBillWave } from 'react-icons/fa';

const Settings = () => {
  const [newEmail, setNewEmail] = useState('');
  const [emails, setEmails] = useState([
    'varun.k@example.com',
    'priya.s@example.com',
    'arjun.m@example.com',
  ]);
  const [redemptionLimit, setRedemptionLimit] = useState('5000');
  const [coinValue, setCoinValue] = useState('0.01');

  const handleAddEmail = () => {
    if (newEmail && !emails.includes(newEmail)) {
      setEmails([...emails, newEmail]);
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  return (
    <div className="px-6 pb-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-3xl mx-auto pt-0">
        <h1 className="text-2xl font-bold text-gray-900">
          Redemption Settings
        </h1>
        <p className="text-gray-500 mt-1">
          Manage your redemption preferences and system values.
        </p>

        {/* Redemption Receipt Management Section */}
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
              className="flex-1 px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
            />
            <button
              onClick={handleAddEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition"
            >
              + Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {emails.map((email, index) => (
              <div key={index} className="flex items-center space-x-1 bg-gray-200 text-gray-700 rounded-full pl-3 pr-1 py-1 text-xs font-medium">
                <span>{email}</span>
                <button
                  onClick={() => handleRemoveEmail(email)}
                  className="p-1 text-gray-500 hover:text-red-500 transition-colors rounded-full hover:bg-gray-300"
                >
                  <FaTimes size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Redemption Limit & Coin Value Section */}
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
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaCoins className="text-gray-400" size={14} />
                </div>
                <input
                  type="text"
                  value={redemptionLimit}
                  onChange={(e) => setRedemptionLimit(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Coin Value
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMoneyBillWave className="text-gray-400" size={14} />
                </div>
                <input
                  type="text"
                  value={coinValue}
                  onChange={(e) => setCoinValue(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <button
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