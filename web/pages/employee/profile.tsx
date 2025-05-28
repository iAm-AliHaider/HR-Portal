import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { shouldBypassAuth } from '@/lib/auth';
import { GetServerSideProps } from 'next';

interface EmployeeProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  workInfo: {
    employeeId: string;
    department: string;
    position: string;
    manager: string;
    startDate: string;
    location: string;
  };
  avatar?: string;
}

const EmployeeProfilePage = () => {
  const router = useRouter();
  const { user, role } = useAuth();
  const allowAccess = shouldBypassAuth(router.query);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<EmployeeProfile>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    workInfo: {
      employeeId: '',
      department: '',
      position: '',
      manager: '',
      startDate: '',
      location: ''
    }
  });

  // Ensure user has access to this page
  useEffect(() => {
    if (!allowAccess && !['employee', 'manager', 'admin'].includes(role)) {
      router.push('/login?redirect=/employee/profile');
    }
  }, [allowAccess, role, router]);

  // Load profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Mock data - replace with actual API call
        const mockProfile: EmployeeProfile = {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: user?.email || 'john.doe@company.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main Street, Anytown, State 12345',
          dateOfBirth: '1990-05-15',
          emergencyContact: {
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+1 (555) 987-6543'
          },
          workInfo: {
            employeeId: 'EMP001',
            department: 'Engineering',
            position: 'Software Developer',
            manager: 'Sarah Johnson',
            startDate: '2022-01-15',
            location: 'New York Office'
          }
        };
        setProfile(mockProfile);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof EmployeeProfile] as any,
          [child]: value
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Here you would make an API call to save the profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Optionally reload the profile data to revert changes
  };

  if (!allowAccess && !['employee', 'manager', 'admin'].includes(role)) {
    return (
      <div className="p-4 md:p-6 flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Profile - HR Management</title>
        <meta name="description" content="View and edit your employee profile" />
      </Head>
      
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">View and update your personal information</p>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Profile Picture & Basic Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                    ) : (
                      <span className="text-3xl text-gray-600">
                        {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h2>
                  <p className="text-gray-600">{profile.workInfo.position}</p>
                  <p className="text-sm text-gray-500">{profile.workInfo.department}</p>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={profile.dateOfBirth}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={profile.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.name"
                    value={profile.emergencyContact.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    name="emergencyContact.relationship"
                    value={profile.emergencyContact.relationship}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="emergencyContact.phone"
                    value={profile.emergencyContact.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>

            {/* Work Information - Read Only */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Work Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={profile.workInfo.employeeId}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={profile.workInfo.department}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={profile.workInfo.position}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Manager
                  </label>
                  <input
                    type="text"
                    value={profile.workInfo.manager}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={new Date(profile.workInfo.startDate).toLocaleDateString()}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={profile.workInfo.location}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default EmployeeProfilePage; 
