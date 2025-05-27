import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/button';
import DashboardLayout from '../components/layout/DashboardLayout';

const initialProfile = {
  name: 'Jane Doe',
  email: 'jane.doe@email.com',
  position: 'Software Engineer',
  department: 'Engineering',
  avatar: '/avatar.png',
};
const mockDocuments = [
  { id: 1, name: 'Offer Letter.pdf', url: '#' },
  { id: 2, name: 'NDA.pdf', url: '#' },
];
const mockActivity = [
  { id: 1, action: 'Logged in', date: '2024-05-01 09:00' },
  { id: 2, action: 'Updated profile', date: '2024-04-28 14:22' },
  { id: 3, action: 'Downloaded payslip', date: '2024-04-25 10:15' },
];

const tabs = ['Personal Info', 'Security', 'Documents', 'Activity'];

const Profile = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(initialProfile);
  const [tab, setTab] = useState('Personal Info');
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [pwMsg, setPwMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(form);
    setEditing(false);
  };

  const handlePwChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  const handlePwSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      setPwMsg('Passwords do not match.');
      return;
    }
    setPwMsg('Password changed!');
    setPasswords({ current: '', new: '', confirm: '' });
    setTimeout(() => setPwMsg(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-xl">
        <div className="flex flex-col items-center mb-6">
          <Image src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full mb-2 border-2 border-blue-100 object-cover" width={80} height={80} />
          <h1 className="text-2xl font-bold text-[#0a3d91]">Profile</h1>
        </div>
        <div className="flex gap-2 mb-6 justify-center">
          {tabs.map(t => (
            <button
              key={t}
              className={`px-4 py-2 rounded-t font-medium border-b-2 transition ${tab === t ? 'border-blue-600 text-blue-700 bg-blue-50' : 'border-transparent text-gray-500 hover:bg-gray-100'}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === 'Personal Info' && (
          !editing ? (
            <div className="space-y-4 text-gray-700">
              <div><span className="font-medium">Name:</span> {profile.name}</div>
              <div><span className="font-medium">Email:</span> {profile.email}</div>
              <div><span className="font-medium">Position:</span> {profile.position}</div>
              <div><span className="font-medium">Department:</span> {profile.department}</div>
              <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                onClick={() => setEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Position</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="position"
                  value={form.position}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Department</label>
                <input
                  className="w-full border rounded px-3 py-2"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  type="submit"
                >
                  Save
                </button>
                <button
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  type="button"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )
        )}
        {tab === 'Security' && (
          <form onSubmit={handlePwSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Current Password</label>
              <input
                className="w-full border rounded px-3 py-2"
                name="current"
                type="password"
                value={passwords.current}
                onChange={handlePwChange}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">New Password</label>
              <input
                className="w-full border rounded px-3 py-2"
                name="new"
                type="password"
                value={passwords.new}
                onChange={handlePwChange}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Confirm New Password</label>
              <input
                className="w-full border rounded px-3 py-2"
                name="confirm"
                type="password"
                value={passwords.confirm}
                onChange={handlePwChange}
                required
              />
            </div>
            {pwMsg && <div className="text-center text-sm text-blue-600">{pwMsg}</div>}
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" type="submit">Change Password</button>
          </form>
        )}
        {tab === 'Documents' && (
          <div className="space-y-4">
            {mockDocuments.map(doc => (
              <div key={doc.id} className="flex items-center justify-between bg-gray-50 rounded p-3">
                <span className="font-medium text-gray-700">{doc.name}</span>
                <a href={doc.url} download className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700">Download</a>
              </div>
            ))}
          </div>
        )}
        {tab === 'Activity' && (
          <ul className="space-y-2">
            {mockActivity.map(act => (
              <li key={act.id} className="flex items-center gap-4 bg-gray-50 rounded p-3 text-sm">
                <span className="text-gray-500">{act.date}</span>
                <span className="text-gray-700">{act.action}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Profile; 
