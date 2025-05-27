import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/useApi';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface OfferManagementProps {
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  department: string;
  onSave: (data: any) => Promise<void>;
  onStatusUpdate: (status: string) => void;
  existingOffer?: any;
}

// Mock company benefits
const companyBenefits = [
  { id: 'health', name: 'Health Insurance', description: 'Comprehensive health coverage' },
  { id: 'dental', name: 'Dental Insurance', description: 'Dental coverage for preventive care' },
  { id: 'vision', name: 'Vision Insurance', description: 'Vision coverage for eye care' },
  { id: '401k', name: '401(k) Plan', description: 'Retirement savings plan with company match' },
  { id: 'pto', name: 'Paid Time Off', description: '15 days of vacation + holidays' },
  { id: 'parental', name: 'Parental Leave', description: '12 weeks of paid parental leave' },
  { id: 'remote', name: 'Remote Work', description: 'Flexible work from home options' },
  { id: 'education', name: 'Education Stipend', description: '$1,000 annual education budget' },
  { id: 'wellness', name: 'Wellness Program', description: 'Gym reimbursement and wellness activities' }
];

// Contract types
const contractTypes = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'temporary', label: 'Temporary' },
  { value: 'internship', label: 'Internship' }
];

export default function OfferManagement({
  applicationId,
  candidateName,
  jobTitle,
  department,
  onSave,
  onStatusUpdate,
  existingOffer
}: OfferManagementProps) {
  const toast = useToast();
  
  // Form state
  const [jobPosition, setJobPosition] = useState(jobTitle);
  const [contractType, setContractType] = useState('full-time');
  const [startDate, setStartDate] = useState('');
  const [baseSalary, setBaseSalary] = useState('');
  const [signOnBonus, setSignOnBonus] = useState('');
  const [offerExpiration, setOfferExpiration] = useState('');
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [additionalTerms, setAdditionalTerms] = useState('');
  const [includePersonalMessage, setIncludePersonalMessage] = useState(true);
  const [personalMessage, setPersonalMessage] = useState('');
  const [sendReminderBeforeExpiration, setSendReminderBeforeExpiration] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [offerStatus, setOfferStatus] = useState<'draft' | 'sent' | 'accepted' | 'rejected' | 'negotiating'>('draft');
  
  // Load existing offer if present
  useEffect(() => {
    if (existingOffer) {
      if (existingOffer.jobPosition) setJobPosition(existingOffer.jobPosition);
      if (existingOffer.contractType) setContractType(existingOffer.contractType);
      if (existingOffer.startDate) setStartDate(existingOffer.startDate);
      if (existingOffer.baseSalary) setBaseSalary(existingOffer.baseSalary);
      if (existingOffer.signOnBonus) setSignOnBonus(existingOffer.signOnBonus);
      if (existingOffer.offerExpiration) setOfferExpiration(existingOffer.offerExpiration);
      if (existingOffer.additionalTerms) setAdditionalTerms(existingOffer.additionalTerms);
      if (existingOffer.personalMessage) setPersonalMessage(existingOffer.personalMessage);
      if (existingOffer.status) setOfferStatus(existingOffer.status);
      
      if (existingOffer.benefits && Array.isArray(existingOffer.benefits)) {
        setSelectedBenefits(existingOffer.benefits.map((b: any) => b.id || b));
      } else {
        // Default benefits
        setSelectedBenefits(['health', 'dental', 'vision', '401k', 'pto']);
      }
      
      if (existingOffer.includePersonalMessage !== undefined) {
        setIncludePersonalMessage(existingOffer.includePersonalMessage);
      }
      
      if (existingOffer.sendReminderBeforeExpiration !== undefined) {
        setSendReminderBeforeExpiration(existingOffer.sendReminderBeforeExpiration);
      }
    } else {
      // Set default benefits
      setSelectedBenefits(['health', 'dental', 'vision', '401k', 'pto']);
      
      // Set default expiration date (14 days from now)
      const twoWeeksFromNow = new Date();
      twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
      setOfferExpiration(twoWeeksFromNow.toISOString().split('T')[0]);
    }
  }, [existingOffer, jobTitle]);
  
  // Toggle benefit selection
  const toggleBenefit = (benefitId: string) => {
    setSelectedBenefits(prev => 
      prev.includes(benefitId)
        ? prev.filter(id => id !== benefitId)
        : [...prev, benefitId]
    );
  };
  
  // Format currency inputs
  const formatCurrency = (value: string) => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (!numericValue) return '';
    
    // Format with commas
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };
  
  // Validate form
  const validateForm = () => {
    if (!jobPosition) {
      toast.error('Please enter a job position');
      return false;
    }
    
    if (!startDate) {
      toast.error('Please select a start date');
      return false;
    }
    
    if (!baseSalary) {
      toast.error('Please enter a base salary');
      return false;
    }
    
    if (!offerExpiration) {
      toast.error('Please select an offer expiration date');
      return false;
    }
    
    if (includePersonalMessage && !personalMessage) {
      toast.error('Please enter a personal message or disable the option');
      return false;
    }
    
    return true;
  };
  
  // Handle form submission
  const handleSave = async (status: 'draft' | 'sent') => {
    if (status === 'sent' && !validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const offerData = {
        applicationId,
        candidateName,
        jobPosition,
        department,
        contractType,
        startDate,
        baseSalary: baseSalary.replace(/[^0-9]/g, ''),
        signOnBonus: signOnBonus.replace(/[^0-9]/g, ''),
        offerExpiration,
        benefits: companyBenefits.filter(benefit => selectedBenefits.includes(benefit.id)),
        additionalTerms,
        includePersonalMessage,
        personalMessage,
        sendReminderBeforeExpiration,
        status: status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      await onSave(offerData);
      
      // Update application status if sending offer
      if (status === 'sent') {
        await onStatusUpdate('Offered');
        setOfferStatus('sent');
      }
      
      toast.success(status === 'sent' ? 'Offer sent successfully' : 'Offer saved as draft');
    } catch (error) {
      toast.error(status === 'sent' ? 'Failed to send offer' : 'Failed to save offer');
      console.error('Error saving offer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle offer status update
  const updateOfferStatus = async (newStatus: 'accepted' | 'rejected' | 'negotiating') => {
    setIsSubmitting(true);
    
    try {
      const updatedOffer = {
        ...existingOffer,
        status: newStatus,
        updatedAt: new Date().toISOString()
      };
      
      await onSave(updatedOffer);
      
      // Update application status based on offer status
      if (newStatus === 'accepted') {
        await onStatusUpdate('Hired');
      } else if (newStatus === 'rejected') {
        await onStatusUpdate('Rejected');
      }
      
      setOfferStatus(newStatus);
      toast.success(`Offer marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update offer status');
      console.error('Error updating offer status:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-md shadow-sm border p-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-xl font-semibold">{candidateName}</h2>
            <p className="text-gray-500">{jobTitle} - {department}</p>
          </div>
          
          {offerStatus !== 'draft' && (
            <div className={`mt-2 md:mt-0 px-4 py-2 rounded-md border text-sm font-medium ${
              offerStatus === 'sent' ? 'bg-blue-50 border-blue-200 text-blue-800' :
              offerStatus === 'accepted' ? 'bg-green-50 border-green-200 text-green-800' :
              offerStatus === 'rejected' ? 'bg-red-50 border-red-200 text-red-800' :
              'bg-yellow-50 border-yellow-200 text-yellow-800'
            }`}>
              Offer {offerStatus.charAt(0).toUpperCase() + offerStatus.slice(1)}
            </div>
          )}
        </div>
      </div>
      
      {existingOffer && offerStatus !== 'draft' ? (
        <Card>
          <CardHeader>
            <CardTitle>Offer Status Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-gray-700">Current Status: <span className="font-medium">{offerStatus.charAt(0).toUpperCase() + offerStatus.slice(1)}</span></p>
              <p className="text-sm text-gray-500 mt-1">Last Updated: {new Date(existingOffer.updatedAt).toLocaleString()}</p>
            </div>
            
            <RadioGroup value={offerStatus} onValueChange={(value: any) => setOfferStatus(value)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 border rounded-lg cursor-pointer ${offerStatus === 'accepted' ? 'bg-green-50 border-green-300' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="accepted" id="status-accepted" />
                    <Label htmlFor="status-accepted" className="font-medium">Accepted</Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Candidate has accepted the offer
                  </p>
                </div>
                
                <div className={`p-4 border rounded-lg cursor-pointer ${offerStatus === 'negotiating' ? 'bg-yellow-50 border-yellow-300' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="negotiating" id="status-negotiating" />
                    <Label htmlFor="status-negotiating" className="font-medium">Negotiating</Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Candidate is negotiating terms
                  </p>
                </div>
                
                <div className={`p-4 border rounded-lg cursor-pointer ${offerStatus === 'rejected' ? 'bg-red-50 border-red-300' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="rejected" id="status-rejected" />
                    <Label htmlFor="status-rejected" className="font-medium">Rejected</Label>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Candidate has declined the offer
                  </p>
                </div>
              </div>
            </RadioGroup>
            
            <div className="mt-6 text-right">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => updateOfferStatus(offerStatus as 'accepted' | 'rejected' | 'negotiating')}
                disabled={isSubmitting || offerStatus === existingOffer.status}
              >
                {isSubmitting ? 'Updating...' : 'Update Offer Status'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Offer Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="job-position">Job Position</Label>
                  <Input
                    id="job-position"
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="contract-type">Contract Type</Label>
                  <Select value={contractType} onValueChange={setContractType}>
                    <SelectTrigger id="contract-type" className="mt-1">
                      <SelectValue placeholder="Select contract type" />
                    </SelectTrigger>
                    <SelectContent>
                      {contractTypes.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="offer-expiration">Offer Expiration Date</Label>
                  <Input
                    id="offer-expiration"
                    type="date"
                    value={offerExpiration}
                    onChange={(e) => setOfferExpiration(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="base-salary">Base Salary (USD)</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      id="base-salary"
                      className="pl-7"
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(formatCurrency(e.target.value))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="sign-on-bonus">Sign-On Bonus (USD, Optional)</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <Input
                      id="sign-on-bonus"
                      className="pl-7"
                      value={signOnBonus}
                      onChange={(e) => setSignOnBonus(formatCurrency(e.target.value))}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <Label>Benefits</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                  {companyBenefits.map((benefit) => (
                    <div 
                      key={benefit.id} 
                      className={`p-3 border rounded-md cursor-pointer hover:bg-gray-50 ${
                        selectedBenefits.includes(benefit.id) ? 'bg-blue-50 border-blue-300' : ''
                      }`}
                      onClick={() => toggleBenefit(benefit.id)}
                    >
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id={`benefit-${benefit.id}`}
                          checked={selectedBenefits.includes(benefit.id)}
                          onChange={() => toggleBenefit(benefit.id)}
                          className="h-4 w-4 text-blue-600 rounded"
                        />
                        <label htmlFor={`benefit-${benefit.id}`} className="ml-2 block font-medium cursor-pointer">
                          {benefit.name}
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-6">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <Label htmlFor="additional-terms">Additional Terms (Optional)</Label>
                <Textarea
                  id="additional-terms"
                  placeholder="Enter any additional terms or conditions for this offer..."
                  value={additionalTerms}
                  onChange={(e) => setAdditionalTerms(e.target.value)}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="personal-message">Include Personal Message</Label>
                  <Switch
                    checked={includePersonalMessage}
                    onCheckedChange={setIncludePersonalMessage}
                    id="personal-message-toggle"
                  />
                </div>
                
                {includePersonalMessage && (
                  <Textarea
                    id="personal-message"
                    placeholder="Enter a personal message to the candidate..."
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    className="min-h-[100px]"
                  />
                )}
              </div>
              
              <div className="mt-6 flex items-center space-x-2">
                <Switch
                  checked={sendReminderBeforeExpiration}
                  onCheckedChange={setSendReminderBeforeExpiration}
                  id="reminder-toggle"
                />
                <Label htmlFor="reminder-toggle" className="cursor-pointer">
                  Send reminder 48 hours before offer expiration
                </Label>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-3 border-t pt-6">
              <Button 
                variant="outline" 
                onClick={() => handleSave('draft')}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save as Draft'}
              </Button>
              
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => handleSave('sent')}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Offer'}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Offer Preview */}
          {jobPosition && startDate && baseSalary && offerExpiration && (
            <Card>
              <CardHeader>
                <CardTitle>Offer Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-md p-6 bg-white">
                  <div className="mb-4 pb-4 border-b">
                    <h3 className="text-xl font-bold mb-1">Job Offer: {jobPosition}</h3>
                    <p className="text-gray-500">Department: {department}</p>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-gray-800">Dear {candidateName},</p>
                    
                    {includePersonalMessage && personalMessage && (
                      <p className="text-gray-800">{personalMessage}</p>
                    )}
                    
                    <p className="text-gray-800">
                      We are pleased to offer you the position of <strong>{jobPosition}</strong> at our company.
                      This is a <strong>{contractTypes.find(t => t.value === contractType)?.label.toLowerCase()}</strong> position,
                      reporting to the {department} department.
                    </p>
                    
                    <div className="space-y-2">
                      <p className="font-medium">Compensation:</p>
                      <ul className="list-disc list-inside text-gray-800 ml-2 space-y-1">
                        <li>Annual Base Salary: <strong>${baseSalary}</strong></li>
                        {signOnBonus && <li>Sign-On Bonus: <strong>${signOnBonus}</strong></li>}
                      </ul>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-medium">Benefits:</p>
                      <ul className="list-disc list-inside text-gray-800 ml-2 space-y-1">
                        {selectedBenefits.map(id => {
                          const benefit = companyBenefits.find(b => b.id === id);
                          return benefit ? (
                            <li key={id}><strong>{benefit.name}</strong>: {benefit.description}</li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                    
                    {additionalTerms && (
                      <div className="space-y-2">
                        <p className="font-medium">Additional Terms:</p>
                        <p className="text-gray-800">{additionalTerms}</p>
                      </div>
                    )}
                    
                    <p className="text-gray-800">
                      Your start date will be <strong>{new Date(startDate).toLocaleDateString()}</strong>. 
                      This offer expires on <strong>{new Date(offerExpiration).toLocaleDateString()}</strong>.
                    </p>
                    
                    <p className="text-gray-800">
                      We are excited about the possibility of you joining our team and look forward to your response.
                    </p>
                    
                    <p className="text-gray-800 mt-6">
                      Sincerely,<br />
                      HR Department
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
} 
