import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface FilterOption {
  id: string;
  label: string;
}

export interface JobFilterValues {
  search: string;
  departments: string[];
  locations: string[];
  types: string[];
  datePosted: string;
}

interface JobFiltersProps {
  onFilterChange: (filters: JobFilterValues) => void;
  departments: FilterOption[];
  locations: FilterOption[];
  types: FilterOption[];
}

export default function JobFilters({ onFilterChange, departments, locations, types }: JobFiltersProps) {
  const [filters, setFilters] = useState<JobFilterValues>({
    search: '',
    departments: [],
    locations: [],
    types: [],
    datePosted: ''
  });
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle search input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, search: e.target.value };
    setFilters(newFilters);
  };
  
  // Handle checkbox filters
  const handleCheckboxChange = (filterType: 'departments' | 'locations' | 'types', value: string) => {
    const currentValues = [...filters[filterType]];
    
    if (currentValues.includes(value)) {
      const newValues = currentValues.filter(v => v !== value);
      setFilters({ ...filters, [filterType]: newValues });
    } else {
      setFilters({ ...filters, [filterType]: [...currentValues, value] });
    }
  };
  
  // Handle date posted filter
  const handleDatePostedChange = (value: string) => {
    setFilters({ ...filters, datePosted: value });
  };
  
  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: '',
      departments: [],
      locations: [],
      types: [],
      datePosted: ''
    });
  };
  
  // Submit filters
  const handleApplyFilters = () => {
    onFilterChange(filters);
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };
  
  // Auto-apply filters on change for desktop
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      onFilterChange(filters);
    }
  }, [filters, onFilterChange]);
  
  return (
    <div className="mb-6">
      {/* Search bar - always visible */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input
          type="search"
          className="block w-full p-3 pl-10 text-sm border border-gray-300 rounded-lg bg-white focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search for jobs by title, keyword, or company"
          value={filters.search}
          onChange={handleSearchChange}
        />
        <button 
          type="button"
          className="absolute right-2 bottom-2 lg:hidden bg-blue-600 text-white px-4 py-1 rounded text-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          Filters
        </button>
      </div>
      
      <div className={`lg:block ${isOpen ? 'block' : 'hidden'}`}>
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Department filter */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Department</h3>
                <div className="space-y-2">
                  {departments.map((department) => (
                    <div key={department.id} className="flex items-center">
                      <input
                        id={`department-${department.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={filters.departments.includes(department.id)}
                        onChange={() => handleCheckboxChange('departments', department.id)}
                      />
                      <label htmlFor={`department-${department.id}`} className="ml-2 text-sm text-gray-600">
                        {department.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Location filter */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Location</h3>
                <div className="space-y-2">
                  {locations.map((location) => (
                    <div key={location.id} className="flex items-center">
                      <input
                        id={`location-${location.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={filters.locations.includes(location.id)}
                        onChange={() => handleCheckboxChange('locations', location.id)}
                      />
                      <label htmlFor={`location-${location.id}`} className="ml-2 text-sm text-gray-600">
                        {location.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Job Type filter */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Job Type</h3>
                <div className="space-y-2">
                  {types.map((type) => (
                    <div key={type.id} className="flex items-center">
                      <input
                        id={`type-${type.id}`}
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        checked={filters.types.includes(type.id)}
                        onChange={() => handleCheckboxChange('types', type.id)}
                      />
                      <label htmlFor={`type-${type.id}`} className="ml-2 text-sm text-gray-600">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Date Posted filter */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Date Posted</h3>
                <div className="space-y-2">
                  {[
                    { id: 'any', label: 'Any time' },
                    { id: 'today', label: 'Today' },
                    { id: 'week', label: 'Past week' },
                    { id: 'month', label: 'Past month' }
                  ].map((option) => (
                    <div key={option.id} className="flex items-center">
                      <input
                        id={`date-${option.id}`}
                        type="radio"
                        name="date-posted"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        checked={filters.datePosted === option.id}
                        onChange={() => handleDatePostedChange(option.id)}
                      />
                      <label htmlFor={`date-${option.id}`} className="ml-2 text-sm text-gray-600">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Filter actions - visible only on mobile */}
            <div className="mt-6 flex justify-between lg:hidden">
              <Button onClick={handleClearFilters} variant="outline">
                Clear Filters
              </Button>
              <Button onClick={handleApplyFilters} className="bg-blue-600 hover:bg-blue-700">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Active filters display and clear button */}
        {(filters.departments.length > 0 || filters.locations.length > 0 || 
          filters.types.length > 0 || filters.datePosted) && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-500">Active filters:</span>
            
            {filters.departments.map(dept => {
              const label = departments.find(d => d.id === dept)?.label || dept;
              return (
                <div key={`dept-${dept}`} className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                  {label}
                  <button 
                    onClick={() => handleCheckboxChange('departments', dept)}
                    className="ml-1 text-blue-500 hover:text-blue-700"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
            
            {filters.locations.map(loc => {
              const label = locations.find(l => l.id === loc)?.label || loc;
              return (
                <div key={`loc-${loc}`} className="bg-green-50 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                  {label}
                  <button 
                    onClick={() => handleCheckboxChange('locations', loc)}
                    className="ml-1 text-green-500 hover:text-green-700"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
            
            {filters.types.map(type => {
              const label = types.find(t => t.id === type)?.label || type;
              return (
                <div key={`type-${type}`} className="bg-purple-50 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                  {label}
                  <button 
                    onClick={() => handleCheckboxChange('types', type)}
                    className="ml-1 text-purple-500 hover:text-purple-700"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              );
            })}
            
            {filters.datePosted && (
              <div className="bg-yellow-50 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                {filters.datePosted === 'today' ? 'Today' : 
                 filters.datePosted === 'week' ? 'Past week' : 
                 filters.datePosted === 'month' ? 'Past month' : 'Any time'}
                <button 
                  onClick={() => handleDatePostedChange('')}
                  className="ml-1 text-yellow-500 hover:text-yellow-700"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            
            <button 
              onClick={handleClearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 ml-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 
