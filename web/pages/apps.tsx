import React, { useState } from 'react';

const mockApps = [
  { id: 1, name: 'Learning Portal', desc: 'Access thousands of learning materials.', icon: '📚', category: 'Productivity' },
  { id: 2, name: 'Payslips', desc: 'Download your latest payslips.', icon: '💸', category: 'HR' },
  { id: 3, name: 'Leave Manager', desc: 'Request and track your leave.', icon: '🌴', category: 'HR' },
  { id: 4, name: 'E-Requests', desc: 'Submit and track online requests.', icon: '📝', category: 'Productivity' },
  { id: 5, name: 'Calendar', desc: 'View company events and holidays.', icon: '📅', category: 'Productivity' },
  { id: 6, name: 'Directory', desc: 'Find and contact colleagues.', icon: '👥', category: 'Social' },
  { id: 7, name: 'Surveys', desc: 'Participate in company surveys.', icon: '🗳️', category: 'Engagement' },
  { id: 8, name: 'Approvals', desc: 'Approve or reject requests.', icon: '✅', category: 'HR' },
];
const categories = ['All', ...Array.from(new Set(mockApps.map(a => a.category)))];

const Apps = () => {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [favorites, setFavorites] = useState<number[]>([]);

  const filtered = mockApps.filter(
    a => (cat === 'All' || a.category === cat) &&
      (a.name.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleFavorite = (id: number) => {
    setFavorites(favs => favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#0a3d91]">Apps</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <input
            className="border rounded px-3 py-2 w-full md:w-64"
            placeholder="Search apps..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2 w-full md:w-48"
            value={cat}
            onChange={e => setCat(e.target.value)}
          >
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map(app => (
            <div key={app.id} className="bg-gray-50 rounded-xl shadow p-4 flex flex-col items-center relative group">
              <div className="text-4xl mb-2">{app.icon}</div>
              <div className="font-semibold text-[#0a3d91] text-center">{app.name}</div>
              <div className="text-xs text-gray-500 text-center mb-2">{app.desc}</div>
              <div className="text-xs text-gray-400 mb-2">{app.category}</div>
              <button
                className={`absolute top-2 right-2 text-xl ${favorites.includes(app.id) ? 'text-yellow-400' : 'text-gray-300 group-hover:text-yellow-400'} transition`}
                onClick={() => toggleFavorite(app.id)}
                aria-label={favorites.includes(app.id) ? 'Unfavorite' : 'Favorite'}
              >
                ★
              </button>
              <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 w-full">Open</button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 mt-8">No apps found.</div>
        )}
      </div>
    </div>
  );
};

export default Apps; 
