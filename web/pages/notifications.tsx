import React, { useState } from 'react';

const mockNotifications = [
  { id: 1, message: 'Your leave request was approved.', read: false },
  { id: 2, message: 'New company survey available.', read: true },
  { id: 3, message: 'Payslip for April is ready to download.', read: false },
];

const Notifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#0a3d91]">Notifications</h1>
        <ul className="space-y-4">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={`flex items-center gap-4 p-4 rounded shadow-sm ${n.read ? 'bg-gray-50 text-gray-400' : 'bg-blue-50 text-blue-900'}`}
            >
              <span className="flex-1">{n.message}</span>
              {!n.read && (
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                  onClick={() => markAsRead(n.id)}
                >
                  Mark as Read
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications; 