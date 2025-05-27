import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal';

interface TrainingCourseFormData {
  title: string;
  description: string;
  category_id: string;
  type: 'onboarding' | 'technical' | 'compliance' | 'leadership' | 'soft_skills' | 'certification' | 'custom';
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  delivery_method: 'in_person' | 'virtual' | 'hybrid' | 'self_paced' | 'blended';
  duration_hours: number;
  max_participants: number;
  min_participants: number;
  prerequisites: string[];
  learning_objectives: string[];
  materials: Array<{
    type: 'document' | 'video' | 'presentation' | 'quiz' | 'assignment' | 'resource';
    title: string;
    description: string;
    url: string;
    duration_minutes: number;
    is_required: boolean;
    order: number;
  }>;
  assessment_required: boolean;
  certification_awarded: boolean;
  certification_validity_months: number;
  cost_per_participant: number;
  tags: string[];
  difficulty_rating: number;
  target_audience: string[];
  required_for_roles: string[];
  expiry_date: string;
}

interface TrainingCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: any | null;
  onSave: (data: TrainingCourseFormData) => Promise<void>;
}

const courseTypes = [
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'technical', label: 'Technical Skills' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'leadership', label: 'Leadership' },
  { value: 'soft_skills', label: 'Soft Skills' },
  { value: 'certification', label: 'Certification' },
  { value: 'custom', label: 'Custom' }
];

const courseLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' }
];

const deliveryMethods = [
  { value: 'in_person', label: 'In-Person' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'self_paced', label: 'Self-Paced' },
  { value: 'blended', label: 'Blended' }
];

const materialTypes = [
  { value: 'document', label: 'Document' },
  { value: 'video', label: 'Video' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'resource', label: 'Resource' }
];

const TrainingCourseModal: React.FC<TrainingCourseModalProps> = ({ 
  isOpen, 
  onClose, 
  course, 
  onSave 
}) => {
  const [formData, setFormData] = useState<TrainingCourseFormData>({
    title: '',
    description: '',
    category_id: '',
    type: 'technical',
    level: 'beginner',
    delivery_method: 'virtual',
    duration_hours: 2,
    max_participants: 20,
    min_participants: 5,
    prerequisites: [],
    learning_objectives: [],
    materials: [],
    assessment_required: false,
    certification_awarded: false,
    certification_validity_months: 12,
    cost_per_participant: 0,
    tags: [],
    difficulty_rating: 3,
    target_audience: [],
    required_for_roles: [],
    expiry_date: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTab, setCurrentTab] = useState('basic');
  const [newPrerequisite, setNewPrerequisite] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newTargetAudience, setNewTargetAudience] = useState('');
  const [newRequiredRole, setNewRequiredRole] = useState('');

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category_id: course.category_id || '',
        type: course.type || 'technical',
        level: course.level || 'beginner',
        delivery_method: course.delivery_method || 'virtual',
        duration_hours: course.duration_hours || 2,
        max_participants: course.max_participants || 20,
        min_participants: course.min_participants || 5,
        prerequisites: course.prerequisites || [],
        learning_objectives: course.learning_objectives || [],
        materials: course.materials || [],
        assessment_required: course.assessment_required || false,
        certification_awarded: course.certification_awarded || false,
        certification_validity_months: course.certification_validity_months || 12,
        cost_per_participant: course.cost_per_participant || 0,
        tags: course.tags || [],
        difficulty_rating: course.difficulty_rating || 3,
        target_audience: course.target_audience || [],
        required_for_roles: course.required_for_roles || [],
        expiry_date: course.expiry_date || ''
      });
    } else {
      // Reset form for new course
      setFormData({
        title: '',
        description: '',
        category_id: '',
        type: 'technical',
        level: 'beginner',
        delivery_method: 'virtual',
        duration_hours: 2,
        max_participants: 20,
        min_participants: 5,
        prerequisites: [],
        learning_objectives: [],
        materials: [],
        assessment_required: false,
        certification_awarded: false,
        certification_validity_months: 12,
        cost_per_participant: 0,
        tags: [],
        difficulty_rating: 3,
        target_audience: [],
        required_for_roles: [],
        expiry_date: ''
      });
    }
    setCurrentTab('basic');
  }, [course, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addItem = (field: 'prerequisites' | 'learning_objectives' | 'tags' | 'target_audience' | 'required_for_roles', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      
      // Reset the input
      switch (field) {
        case 'prerequisites':
          setNewPrerequisite('');
          break;
        case 'learning_objectives':
          setNewObjective('');
          break;
        case 'tags':
          setNewTag('');
          break;
        case 'target_audience':
          setNewTargetAudience('');
          break;
        case 'required_for_roles':
          setNewRequiredRole('');
          break;
      }
    }
  };

  const removeItem = (field: 'prerequisites' | 'learning_objectives' | 'tags' | 'target_audience' | 'required_for_roles', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addMaterial = () => {
    const newMaterial = {
      type: 'document' as const,
      title: '',
      description: '',
      url: '',
      duration_minutes: 30,
      is_required: true,
      order: formData.materials.length + 1
    };
    
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, newMaterial]
    }));
  };

  const updateMaterial = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map((material, i) => 
        i === index ? { ...material, [field]: value } : material
      )
    }));
  };

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.filter((_, i) => i !== index)
    }));
  };

  const TabButton = ({ tab, label }: { tab: string; label: string }) => (
    <button
      type="button"
      onClick={() => setCurrentTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
        currentTab === tab
          ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-700'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={course ? 'Edit Training Course' : 'Create New Training Course'}
      size="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <TabButton tab="basic" label="Basic Info" />
            <TabButton tab="content" label="Content & Materials" />
            <TabButton tab="assessment" label="Assessment & Certification" />
            <TabButton tab="settings" label="Settings & Requirements" />
          </nav>
        </div>

        {/* Basic Information Tab */}
        {currentTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="e.g., React.js Fundamentals"
                />
              </div>

              <div>
                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="category_id"
                  value={formData.category_id}
                  onChange={(e) => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select category</option>
                  <option value="programming">Programming</option>
                  <option value="design">Design</option>
                  <option value="management">Management</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                  <option value="marketing">Marketing</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                placeholder="Describe what participants will learn and achieve"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Course Type *
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {courseTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Level *
                </label>
                <select
                  id="level"
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {courseLevels.map(level => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="delivery_method" className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Method *
                </label>
                <select
                  id="delivery_method"
                  value={formData.delivery_method}
                  onChange={(e) => setFormData(prev => ({ ...prev, delivery_method: e.target.value as any }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {deliveryMethods.map(method => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="duration_hours" className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (hours) *
                </label>
                <input
                  type="number"
                  id="duration_hours"
                  value={formData.duration_hours}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0.5"
                  step="0.5"
                />
              </div>

              <div>
                <label htmlFor="min_participants" className="block text-sm font-medium text-gray-700 mb-2">
                  Min Participants
                </label>
                <input
                  type="number"
                  id="min_participants"
                  value={formData.min_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_participants: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-2">
                  Max Participants
                </label>
                <input
                  type="number"
                  id="max_participants"
                  value={formData.max_participants}
                  onChange={(e) => setFormData(prev => ({ ...prev, max_participants: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Content & Materials Tab */}
        {currentTab === 'content' && (
          <div className="space-y-6">
            {/* Learning Objectives */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Learning Objectives
              </label>
              <div className="space-y-2">
                {formData.learning_objectives.map((objective, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => {
                        const updated = [...formData.learning_objectives];
                        updated[index] = e.target.value;
                        setFormData(prev => ({ ...prev, learning_objectives: updated }));
                      }}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem('learning_objectives', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add learning objective"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('learning_objectives', newObjective))}
                  />
                  <button
                    type="button"
                    onClick={() => addItem('learning_objectives', newObjective)}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Prerequisites
              </label>
              <div className="space-y-2">
                {formData.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={prerequisite}
                      onChange={(e) => {
                        const updated = [...formData.prerequisites];
                        updated[index] = e.target.value;
                        setFormData(prev => ({ ...prev, prerequisites: updated }));
                      }}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem('prerequisites', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    placeholder="Add prerequisite"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('prerequisites', newPrerequisite))}
                  />
                  <button
                    type="button"
                    onClick={() => addItem('prerequisites', newPrerequisite)}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Materials */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Course Materials
                </label>
                <button
                  type="button"
                  onClick={addMaterial}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                >
                  Add Material
                </button>
              </div>
              <div className="space-y-4">
                {formData.materials.map((material, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                        <select
                          value={material.type}
                          onChange={(e) => updateMaterial(index, 'type', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        >
                          {materialTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Duration (min)</label>
                        <input
                          type="number"
                          value={material.duration_minutes}
                          onChange={(e) => updateMaterial(index, 'duration_minutes', parseInt(e.target.value) || 0)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input
                          type="text"
                          value={material.title}
                          onChange={(e) => updateMaterial(index, 'title', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="Material title"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                        <input
                          type="url"
                          value={material.url}
                          onChange={(e) => updateMaterial(index, 'url', e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                      <textarea
                        value={material.description}
                        onChange={(e) => updateMaterial(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                        rows={2}
                        placeholder="Brief description"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={material.is_required}
                          onChange={(e) => updateMaterial(index, 'is_required', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Required</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => removeMaterial(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Assessment & Certification Tab */}
        {currentTab === 'assessment' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="assessment_required"
                  checked={formData.assessment_required}
                  onChange={(e) => setFormData(prev => ({ ...prev, assessment_required: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="assessment_required" className="text-sm font-medium text-gray-700">
                  Assessment Required
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="certification_awarded"
                  checked={formData.certification_awarded}
                  onChange={(e) => setFormData(prev => ({ ...prev, certification_awarded: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="certification_awarded" className="text-sm font-medium text-gray-700">
                  Certification Awarded
                </label>
              </div>
            </div>

            {formData.certification_awarded && (
              <div>
                <label htmlFor="certification_validity_months" className="block text-sm font-medium text-gray-700 mb-2">
                  Certificate Validity (months)
                </label>
                <input
                  type="number"
                  id="certification_validity_months"
                  value={formData.certification_validity_months}
                  onChange={(e) => setFormData(prev => ({ ...prev, certification_validity_months: parseInt(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cost_per_participant" className="block text-sm font-medium text-gray-700 mb-2">
                  Cost per Participant ($)
                </label>
                <input
                  type="number"
                  id="cost_per_participant"
                  value={formData.cost_per_participant}
                  onChange={(e) => setFormData(prev => ({ ...prev, cost_per_participant: parseFloat(e.target.value) || 0 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label htmlFor="difficulty_rating" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty Rating (1-5)
                </label>
                <input
                  type="number"
                  id="difficulty_rating"
                  value={formData.difficulty_rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty_rating: parseInt(e.target.value) || 1 }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="5"
                />
              </div>
            </div>

            <div>
              <label htmlFor="expiry_date" className="block text-sm font-medium text-gray-700 mb-2">
                Course Expiry Date
              </label>
              <input
                type="date"
                id="expiry_date"
                value={formData.expiry_date}
                onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {/* Settings & Requirements Tab */}
        {currentTab === 'settings' && (
          <div className="space-y-6">
            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags.map((tag, index) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeItem('tags', index)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('tags', newTag))}
                />
                <button
                  type="button"
                  onClick={() => addItem('tags', newTag)}
                  className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Target Audience
              </label>
              <div className="space-y-2">
                {formData.target_audience.map((audience, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={audience}
                      onChange={(e) => {
                        const updated = [...formData.target_audience];
                        updated[index] = e.target.value;
                        setFormData(prev => ({ ...prev, target_audience: updated }));
                      }}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem('target_audience', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTargetAudience}
                    onChange={(e) => setNewTargetAudience(e.target.value)}
                    placeholder="Add target audience"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('target_audience', newTargetAudience))}
                  />
                  <button
                    type="button"
                    onClick={() => addItem('target_audience', newTargetAudience)}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Required for Roles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Required for Roles
              </label>
              <div className="space-y-2">
                {formData.required_for_roles.map((role, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => {
                        const updated = [...formData.required_for_roles];
                        updated[index] = e.target.value;
                        setFormData(prev => ({ ...prev, required_for_roles: updated }));
                      }}
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem('required_for_roles', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newRequiredRole}
                    onChange={(e) => setNewRequiredRole(e.target.value)}
                    placeholder="Add required role"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('required_for_roles', newRequiredRole))}
                  />
                  <button
                    type="button"
                    onClick={() => addItem('required_for_roles', newRequiredRole)}
                    className="px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default TrainingCourseModal; 