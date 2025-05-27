import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  VStack,
  HStack,
  Box,
  Text,
  Badge,
  Avatar,
  useToast,
  Input,
  Checkbox,
  Alert,
  AlertIcon,
  Divider,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagCloseButton,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { EmailIcon, AddIcon, InfoIcon } from '@chakra-ui/icons';
import { Application, User } from '../../../packages/types';

interface BulkEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  applications: (Application & { candidate?: User })[];
  onSendEmails: (emailData: any) => Promise<void>;
}

const BulkEmailModal: React.FC<BulkEmailModalProps> = ({
  isOpen,
  onClose,
  applications,
  onSendEmails
}) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    template: '',
    subject: '',
    message: '',
    sendToCandidate: true,
    sendCcToTeam: false,
    ccEmails: [] as string[],
    personalizeMessage: true,
    scheduleDelivery: false,
    deliveryDate: '',
    deliveryTime: '09:00'
  });

  // Email templates
  const emailTemplates = [
    {
      id: 'application_received',
      name: 'Application Received',
      subject: 'Thank you for your application - {position}',
      message: `Dear {candidate_name},

Thank you for your interest in the {position} role at our company. We have received your application and our team is currently reviewing it.

We appreciate the time you took to apply and will keep you updated on the status of your application. If you are selected to move forward in the process, we will contact you within the next 5-7 business days.

If you have any questions in the meantime, please don't hesitate to reach out.

Best regards,
{company_name} Recruiting Team`
    },
    {
      id: 'interview_invitation',
      name: 'Interview Invitation',
      subject: 'Interview Invitation - {position}',
      message: `Dear {candidate_name},

We are pleased to inform you that after reviewing your application for the {position} role, we would like to invite you for an interview.

We will be in touch shortly to schedule a convenient time for both parties. Please expect a calendar invitation with all the details including the interview format, duration, and any preparation materials.

We look forward to speaking with you and learning more about your background and experience.

Best regards,
{company_name} Recruiting Team`
    },
    {
      id: 'application_update',
      name: 'Application Status Update',
      subject: 'Update on your application - {position}',
      message: `Dear {candidate_name},

We wanted to provide you with an update on your application for the {position} role.

Your application is currently being reviewed by our hiring team, and we expect to make a decision within the next few days. We will contact you as soon as we have more information to share.

Thank you for your continued interest in joining our team.

Best regards,
{company_name} Recruiting Team`
    },
    {
      id: 'rejection_polite',
      name: 'Application Not Selected',
      subject: 'Update on your application - {position}',
      message: `Dear {candidate_name},

Thank you for your interest in the {position} role at our company and for taking the time to go through our interview process.

After careful consideration, we have decided to move forward with other candidates whose experience more closely aligns with our current needs.

This was a difficult decision as we were impressed by your background and qualifications. We encourage you to apply for future opportunities that match your skills and experience.

We wish you the best of luck in your job search.

Best regards,
{company_name} Recruiting Team`
    },
    {
      id: 'offer_congratulations',
      name: 'Job Offer',
      subject: 'Congratulations! Job Offer - {position}',
      message: `Dear {candidate_name},

Congratulations! We are delighted to extend an offer for the {position} role at our company.

We were very impressed with your qualifications, experience, and the enthusiasm you demonstrated during the interview process. We believe you will be a valuable addition to our team.

Please expect a formal offer letter with all the details including compensation, benefits, and start date within the next 24 hours. If you have any questions, please don't hesitate to reach out.

We look forward to having you join our team!

Best regards,
{company_name} Recruiting Team`
    }
  ];

  const handleTemplateChange = (templateId: string) => {
    const template = emailTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({
        ...prev,
        template: templateId,
        subject: template.subject,
        message: template.message
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        template: '',
        subject: '',
        message: ''
      }));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addCcEmail = (email: string) => {
    if (email && !formData.ccEmails.includes(email)) {
      setFormData(prev => ({
        ...prev,
        ccEmails: [...prev.ccEmails, email]
      }));
    }
  };

  const removeCcEmail = (email: string) => {
    setFormData(prev => ({
      ...prev,
      ccEmails: prev.ccEmails.filter(e => e !== email)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.subject || !formData.message) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in both subject and message fields.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const emailData = {
        template: formData.template,
        subject: formData.subject,
        message: formData.message,
        sendToCandidate: formData.sendToCandidate,
        sendCcToTeam: formData.sendCcToTeam,
        ccEmails: formData.ccEmails,
        personalizeMessage: formData.personalizeMessage,
        scheduleDelivery: formData.scheduleDelivery,
        deliveryDate: formData.deliveryDate,
        deliveryTime: formData.deliveryTime,
        recipientCount: applications.length,
        applications: applications.map(app => ({
          id: app.id,
          candidateName: app.candidate?.full_name || 'Candidate',
          candidateEmail: app.candidate?.email || '',
          position: 'Position' // Would come from job data
        }))
      };

      await onSendEmails(emailData);
      
      toast({
        title: 'Emails Sent',
        description: `Successfully sent emails to ${applications.length} candidates`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send emails. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getPersonalizedPreview = () => {
    if (!formData.personalizeMessage || applications.length === 0) {
      return formData.message;
    }

    const firstApp = applications[0];
    return formData.message
      .replace(/{candidate_name}/g, firstApp.candidate?.full_name || 'John Doe')
      .replace(/{position}/g, 'Sample Position')
      .replace(/{company_name}/g, 'Your Company');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent maxW="700px">
        <ModalHeader>
          <HStack>
            <EmailIcon />
            <Text>Send Bulk Email</Text>
            <Badge colorScheme="blue">{applications.length} recipients</Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Recipients Preview */}
            <Box p={4} bg="gray.50" borderRadius="md">
              <Text fontWeight="bold" mb={2}>Recipients ({applications.length})</Text>
              <Wrap>
                {applications.slice(0, 5).map((app) => (
                  <WrapItem key={app.id}>
                    <HStack spacing={2}>
                      <Avatar size="xs" name={app.candidate?.full_name} src={app.candidate?.avatar_url} />
                      <Text fontSize="sm">{app.candidate?.full_name}</Text>
                    </HStack>
                  </WrapItem>
                ))}
                {applications.length > 5 && (
                  <WrapItem>
                    <Text fontSize="sm" color="gray.500">
                      +{applications.length - 5} more
                    </Text>
                  </WrapItem>
                )}
              </Wrap>
            </Box>

            <Divider />

            {/* Email Template Selection */}
            <FormControl>
              <FormLabel>Email Template</FormLabel>
              <Select
                value={formData.template}
                onChange={(e) => handleTemplateChange(e.target.value)}
                placeholder="Select a template or create custom email"
              >
                {emailTemplates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            {/* Subject */}
            <FormControl isRequired>
              <FormLabel>Subject</FormLabel>
              <Input
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Email subject line"
              />
            </FormControl>

            {/* Message */}
            <FormControl isRequired>
              <FormLabel>Message</FormLabel>
              <Textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Email message content"
                rows={10}
              />
              
              {formData.personalizeMessage && (
                <Alert status="info" size="sm" mt={2}>
                  <AlertIcon />
                  <Box>
                    <Text fontSize="xs">
                      <strong>Available variables:</strong> {'{candidate_name}'}, {'{position}'}, {'{company_name}'}
                    </Text>
                  </Box>
                </Alert>
              )}
            </FormControl>

            {/* Email Options */}
            <VStack spacing={3} align="stretch">
              <Checkbox
                isChecked={formData.personalizeMessage}
                onChange={(e) => handleInputChange('personalizeMessage', e.target.checked)}
              >
                Personalize messages with candidate names and position details
              </Checkbox>

              <Checkbox
                isChecked={formData.sendCcToTeam}
                onChange={(e) => handleInputChange('sendCcToTeam', e.target.checked)}
              >
                CC team members on emails
              </Checkbox>

              {formData.sendCcToTeam && (
                <Box ml={6}>
                  <FormLabel fontSize="sm">CC Email Addresses</FormLabel>
                  <HStack>
                    <Input
                      placeholder="Enter email address"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addCcEmail((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Tooltip label="Press Enter to add">
                      <IconButton
                        icon={<AddIcon />}
                        size="sm"
                        aria-label="Add email"
                      />
                    </Tooltip>
                  </HStack>
                  <Wrap mt={2}>
                    {formData.ccEmails.map((email) => (
                      <WrapItem key={email}>
                        <Tag size="sm" colorScheme="blue" variant="subtle">
                          <TagLabel>{email}</TagLabel>
                          <TagCloseButton onClick={() => removeCcEmail(email)} />
                        </Tag>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              )}

              <Checkbox
                isChecked={formData.scheduleDelivery}
                onChange={(e) => handleInputChange('scheduleDelivery', e.target.checked)}
              >
                Schedule delivery for later
              </Checkbox>

              {formData.scheduleDelivery && (
                <HStack ml={6}>
                  <FormControl>
                    <FormLabel fontSize="sm">Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange('deliveryDate', e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="sm">Time</FormLabel>
                    <Input
                      type="time"
                      value={formData.deliveryTime}
                      onChange={(e) => handleInputChange('deliveryTime', e.target.value)}
                    />
                  </FormControl>
                </HStack>
              )}
            </VStack>

            {/* Preview */}
            {formData.personalizeMessage && (
              <>
                <Divider />
                <Box>
                  <Text fontWeight="bold" mb={2}>Preview (Personalized)</Text>
                  <Box p={3} bg="gray.50" borderRadius="md" fontSize="sm">
                    <Text fontWeight="bold" mb={2}>Subject: {formData.subject.replace(/{position}/g, 'Sample Position')}</Text>
                    <Text whiteSpace="pre-wrap">{getPersonalizedPreview()}</Text>
                  </Box>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
            leftIcon={<EmailIcon />}
          >
            {formData.scheduleDelivery ? 'Schedule' : 'Send'} Emails ({applications.length})
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BulkEmailModal; 
