import { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ModernDashboardLayout from '@/components/layout/ModernDashboardLayout';
import { jobService } from '@/services/api';
import { useToast } from '@/hooks/useApi';
import RequireRole from '@/components/auth/RequireRole';
import { GetServerSideProps } from 'next';

interface FormData {
  title: string;
  department: string;
  location: string;
  type: string;
  salary_range: string;
  description: string;
  requirements: string;
  closing_date: string;
}

interface FormErrors {
  title?: string;
  department?: string;
  description?: string;
  location?: string;
  type?: string;
}


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: showError } = useToast();
  
  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    department: '',
    location: '',
    type: '',
    salary_range: '',
    description: '',
    requirements: '',
    closing_date: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  
  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };
  
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title) {
      newErrors.title = 'Job title is required';
    }
    
    if (!formData.department) {
      newErrors.department = 'Department is required';
    }
    
    if (!formData.description) {
      newErrors.description = 'Job description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      const response = await jobService.createJob(formData);
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      success('Job posted successfully');
      router.push('/jobs');
    } catch (err) {
      console.error('Error creating job:', err);
      showError(err instanceof Error ? err.message : 'Failed to post job');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireRole roles={['admin', 'hr', 'recruiter']}>
      <ModernDashboardLayout title="Post a Job" subtitle="Create a new job listing">
        <Card>
          <CardHeader>
            <CardTitle>New Job Listing</CardTitle>
            <CardDescription>Fill in the details to create a new job listing</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="title">
                    Job Title*
                  </label>
                  <Input
                    id="title"
                    placeholder="e.g. Senior Software Engineer"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="department">
                    Department*
                  </label>
                  <Select onValueChange={(value) => handleChange('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.department && (
                    <p className="text-sm text-red-500 mt-1">{errors.department}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="location">
                    Location*
                  </label>
                  <Select onValueChange={(value) => handleChange('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Remote">Remote</SelectItem>
                      <SelectItem value="New York">New York</SelectItem>
                      <SelectItem value="San Francisco">San Francisco</SelectItem>
                      <SelectItem value="London">London</SelectItem>
                      <SelectItem value="Berlin">Berlin</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.location && (
                    <p className="text-sm text-red-500 mt-1">{errors.location}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="type">
                    Employment Type*
                  </label>
                  <Select onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.type && (
                    <p className="text-sm text-red-500 mt-1">{errors.type}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="salary_range">
                    Salary Range
                  </label>
                  <Input
                    id="salary_range"
                    placeholder="e.g. $80k - $120k"
                    value={formData.salary_range}
                    onChange={(e) => handleChange('salary_range', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="description">
                    Job Description*
                  </label>
                  <Textarea
                    id="description"
                    rows={5}
                    placeholder="Describe the role, responsibilities, and expectations"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="requirements">
                    Requirements
                  </label>
                  <Textarea
                    id="requirements"
                    rows={4}
                    placeholder="List the required skills, qualifications, and experience"
                    value={formData.requirements}
                    onChange={(e) => handleChange('requirements', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" htmlFor="closing_date">
                    Closing Date
                  </label>
                  <Input
                    id="closing_date"
                    type="date"
                    value={formData.closing_date}
                    onChange={(e) => handleChange('closing_date', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/jobs')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Job'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </ModernDashboardLayout>
    </RequireRole>
  );
} 
