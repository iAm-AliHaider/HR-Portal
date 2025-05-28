import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  useFacilitiesRooms, 
  useToast, 
  useForm, 
  useModal, 
  usePagination, 
  useSearch 
} from '../../hooks/useApi';
import { GetServerSideProps } from 'next';

// Room form interface
interface RoomForm {
  name: string;
  description: string;
  location: string;
  building: string;
  floor: string;
  capacity: number;
  equipment: string[];
  amenities: string[];
  hourly_rate: number;
  contact_person: string;
  contact_email: string;
  contact_phone: string;
  video_conference_enabled: boolean;
  accessibility_features: string[];
}

const FacilitiesRoomsPage = () => {
  const router = useRouter();
  const toast = useToast();
  
  // API hooks
  const { 
    rooms, 
    loading, 
    error, 
    createRoom, 
    updateRoom, 
    deleteRoom 
  } = useFacilitiesRooms();

  // UI state
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modals
  const addModal = useModal();
  const editModal = useModal();
  const detailsModal = useModal();
  const deleteModal = useModal();

  // Search and pagination
  const { searchTerm, setSearchTerm, filteredItems } = useSearch(
    rooms, 
    ['name', 'location', 'building', 'floor']
  );
  const { currentItems, currentPage, totalPages, hasNext, hasPrev, nextPage, prevPage } = 
    usePagination(filteredItems, 12);

  // Form management
  const form = useForm<RoomForm>({
    name: '',
    description: '',
    location: '',
    building: '',
    floor: '',
    capacity: 0,
    equipment: [],
    amenities: [],
    hourly_rate: 0,
    contact_person: '',
    contact_email: '',
    contact_phone: '',
    video_conference_enabled: false,
    accessibility_features: []
  });

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    let hasErrors = false;
    
    if (!form.values.name) {
      form.setError('name', 'Room name is required');
      hasErrors = true;
    }
    
    if (!form.values.location) {
      form.setError('location', 'Location is required');
      hasErrors = true;
    }
    
    if (!form.values.capacity || form.values.capacity <= 0) {
      form.setError('capacity', 'Valid capacity is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsSubmitting(true);
    
    try {
      if (selectedRoom) {
        await updateRoom(selectedRoom.id, form.values);
        toast.success('Room updated successfully!');
        editModal.closeModal();
      } else {
        await createRoom(form.values);
        toast.success('Room created successfully!');
        addModal.closeModal();
      }
      form.reset();
      setSelectedRoom(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save room');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!selectedRoom) return;
    
    setIsSubmitting(true);
    try {
      await deleteRoom(selectedRoom.id);
      toast.success('Room deleted successfully!');
      deleteModal.closeModal();
      setSelectedRoom(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete room');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle edit
  const handleEdit = (room: any) => {
    setSelectedRoom(room);
    // Populate form with room data
    Object.keys(form.values).forEach(key => {
      if (room[key] !== undefined) {
        form.setValue(key as keyof RoomForm, room[key]);
      }
    });
    editModal.openModal();
  };

  // Calculate statistics
  const stats = {
    total: rooms.length,
    available: rooms.filter(room => room.status === 'available').length,
    occupied: rooms.filter(room => room.status === 'occupied').length,
    maintenance: rooms.filter(room => room.status === 'maintenance').length
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head>
        <title>Meeting Rooms | HR System</title>
      </Head>

      <div className="container mx-auto px-4 py-8">
          {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meeting Rooms</h1>
              <p className="text-gray-600 mt-2">Manage meeting rooms and facilities</p>
            </div>
            <button
              onClick={() => {
                form.reset();
                setSelectedRoom(null);
                addModal.openModal();
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Room
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Rooms</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="text-3xl">🏢</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available</p>
                  <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                </div>
                <div className="text-3xl">✅</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Occupied</p>
                  <p className="text-2xl font-bold text-red-600">{stats.occupied}</p>
                </div>
                <div className="text-3xl">🚫</div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
              <div>
                  <p className="text-sm font-medium text-gray-600">Maintenance</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
                </div>
                <div className="text-3xl">🔧</div>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                />
              </div>
            </div>
          </div>
              </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

          {/* Rooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentItems.map(room => (
            <div key={room.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{room.location}</p>
                  <p className="text-sm text-gray-500">{room.building}, Floor {room.floor}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  room.status === 'available' ? 'bg-green-100 text-green-800' :
                  room.status === 'occupied' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {room.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm mb-4">
                <p><span className="font-medium">Capacity:</span> {room.capacity} people</p>
                <p><span className="font-medium">Rate:</span> ${room.hourly_rate}/hour</p>
                <p><span className="font-medium">Equipment:</span> {room.equipment.length} items</p>
                {room.video_conference_enabled && (
                  <p><span className="font-medium">Video Conf:</span> ✅ Available</p>
                )}
            </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setSelectedRoom(room);
                    detailsModal.openModal();
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200"
                >
                  Details
                </button>
                        <button
                  onClick={() => handleEdit(room)}
                  className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm hover:bg-blue-200"
                        >
                  Edit
                        </button>
                        <button
                  onClick={() => {
                    setSelectedRoom(room);
                    deleteModal.openModal();
                  }}
                  className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded-md text-sm hover:bg-red-200"
                >
                  Delete
                        </button>
                      </div>
                    </div>
          ))}
                      </div>

        {/* Toast Notifications */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          {toast.toasts.map(t => (
            <div
              key={t.id}
              className={`px-6 py-3 rounded-lg shadow-lg text-white ${
                t.type === 'success' ? 'bg-green-500' :
                t.type === 'error' ? 'bg-red-500' :
                t.type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
            >
              <div className="flex justify-between items-center">
                <span>{t.message}</span>
                      <button
                  onClick={() => toast.removeToast(t.id)}
                  className="ml-2 text-white hover:text-gray-200"
                      >
                  ✕
                      </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
      </DashboardLayout>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default FacilitiesRoomsPage; 
