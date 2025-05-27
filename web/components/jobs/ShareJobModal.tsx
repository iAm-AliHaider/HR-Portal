import { useState } from 'react';
import { useToast } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { validateEmail } from '@/lib/validators';

interface ShareJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: {
    id: string;
    title: string;
    department: string;
    location: string;
  };
}

export default function ShareJobModal({ isOpen, onClose, job }: ShareJobModalProps) {
  const toast = useToast();
  const [emailRecipient, setEmailRecipient] = useState('');
  const [emailMessage, setEmailMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSending, setIsSending] = useState(false);
  
  // Get the current URL for sharing
  const jobUrl = typeof window !== 'undefined' ? 
    `${window.location.origin}/jobs/${job.id}` : 
    `/jobs/${job.id}`;
  
  // Handle copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(jobUrl);
      toast.success('Job URL copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };
  
  // Handle email sharing
  const handleEmailShare = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!emailRecipient) {
      setEmailError('Email address is required');
      return;
    }
    
    if (!validateEmail(emailRecipient)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setEmailError('');
    setIsSending(true);
    
    try {
      // In a real implementation, we would call an API to send the email
      // For now, we'll simulate a successful email send
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Job shared with ${emailRecipient}`);
      setEmailRecipient('');
      setEmailMessage('');
      onClose();
    } catch (error) {
      toast.error('Failed to share job via email');
    } finally {
      setIsSending(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4">Share this Job</h2>
        
        <div className="space-y-4 mb-6">
          {/* Social media sharing */}
          <div className="flex flex-wrap gap-2">
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
              </svg>
              <span>Facebook</span>
            </a>
            
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out this job opportunity: ${job.title} at ${job.department}`)}&url=${encodeURIComponent(jobUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              <span>Twitter</span>
            </a>
            
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
          
          {/* Copy link */}
          <div className="relative">
            <div className="flex items-center">
              <input 
                type="text"
                readOnly
                value={jobUrl}
                className="w-full border border-gray-300 rounded-md px-3 py-2 pr-20"
              />
              <button 
                onClick={handleCopyLink}
                className="absolute right-1 top-1 px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200"
              >
                Copy
              </button>
            </div>
          </div>
          
          {/* Email sharing form */}
          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium mb-2">Share via Email</h3>
            <form onSubmit={handleEmailShare}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    className={`w-full border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md px-3 py-2`}
                    placeholder="colleague@example.com"
                    value={emailRecipient}
                    onChange={(e) => {
                      setEmailRecipient(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                  <textarea
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-20"
                    placeholder="I thought you might be interested in this job opportunity..."
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                  ></textarea>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSending}
                >
                  {isSending ? 'Sending...' : 'Send Email'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">Close</Button>
        </div>
      </div>
    </div>
  );
} 