import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Stack,
  Heading,
  Grid,
  GridItem,
  FormErrorMessage,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  useToast,
  Switch,
  FormHelperText,
  Text,
  HStack,
  Badge,
  Radio,
  RadioGroup,
  Alert,
  AlertIcon,
  Checkbox
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { Offer, Application, User } from '../../../packages/types';
import { getApplicationById, getCandidateById } from '../../services/applications';
import { getJobById } from '../../services/jobs';
import { getOfferById, createOffer, updateOffer, getCommonBenefits } from '../../services/offers';

interface OfferFormProps {
  offerId?: string;
  applicationId?: string;
  onSave?: (offer: Offer) => void;
}

const OfferForm = ({ offerId, applicationId, onSave }: OfferFormProps) => {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!offerId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [application, setApplication] = useState<Application | null>(null);
  const [candidate, setCandidate] = useState<User | null>(null);
  const [job, setJob] = useState<any>(null);
  const [newBenefit, setNewBenefit] = useState('');
  const [commonBenefits, setCommonBenefits] = useState<string[]>([]);
  const [startDateString, setStartDateString] = useState('');
  const [expirationDateString, setExpirationDateString] = useState('');

  const [offer, setOffer] = useState<Partial<Offer>>({
    status: 'draft',
    position_title: '',
    salary: {
      amount: 0,
      currency: 'USD',
      period: 'yearly'
    },
    benefits: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Load common benefits
        setCommonBenefits(getCommonBenefits());

        if (offerId) {
          // Fetch existing offer data
          const offerData = await getOfferById(offerId);
          if (offerData) {
            setOffer(offerData);
            
            // Set date input values
            if (offerData.start_date) {
              setStartDateString(offerData.start_date.split('T')[0]);
            }
            
            if (offerData.expiration_date) {
              setExpirationDateString(offerData.expiration_date.split('T')[0]);
            }
            
            // Fetch related application and job data
            if (offerData.application_id) {
              const appData = await getApplicationById(offerData.application_id);
              setApplication(appData);
              
              if (appData) {
                // Fetch candidate
                if (appData.user_id) {
                  const candidateData = await getCandidateById(appData.user_id);
                  setCandidate(candidateData);
                }
                
                // Fetch job
                if (appData.job_id) {
                  const jobData = await getJobById(appData.job_id);
                  setJob(jobData);
                }
              }
            } else if (offerData.job_id) {
              const jobData = await getJobById(offerData.job_id);
              setJob(jobData);
            }
          } else {
            toast({
              title: 'Error',
              description: 'Offer not found',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            router.push('/offers');
          }
        } else if (applicationId) {
          // Fetch application data for new offer
          const appData = await getApplicationById(applicationId);
          if (appData) {
            setApplication(appData);
            
            // Set initial offer data from application
            setOffer(prev => ({
              ...prev,
              application_id: applicationId,
              job_id: appData.job_id,
              candidate_id: appData.user_id,
              org_id: appData.org_id
            }));
            
            // Fetch candidate
            if (appData.user_id) {
              const candidateData = await getCandidateById(appData.user_id);
              setCandidate(candidateData);
            }
            
            // Fetch job
            if (appData.job_id) {
              const jobData = await getJobById(appData.job_id);
              setJob(jobData);
              
              // Use job title for offer position title
              if (jobData?.title) {
                setOffer(prev => ({
                  ...prev,
                  position_title: jobData.title
                }));
              }
            }
          } else {
            toast({
              title: 'Error',
              description: 'Application not found',
              status: 'error',
              duration: 5000,
              isClosable: true,
            });
            router.push('/applications');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [offerId, applicationId, router, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested salary object properties
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setOffer(prev => ({
        ...prev,
        salary: {
          ...prev.salary!,
          [salaryField]: value
        }
      }));
    } else {
      setOffer(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (name: string, value: number) => {
    if (name.startsWith('salary.')) {
      const salaryField = name.split('.')[1];
      setOffer(prev => ({
        ...prev,
        salary: {
          ...prev.salary!,
          [salaryField]: value
        }
      }));
    } else if (name.startsWith('bonus.')) {
      const bonusField = name.split('.')[1];
      setOffer(prev => ({
        ...prev,
        bonus: {
          ...prev.bonus as any,
          [bonusField]: value
        }
      }));
    } else {
      setOffer(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartDateString(value);
    
    if (value) {
      // Append time to make a valid ISO string
      const date = new Date(`${value}T00:00:00`);
      setOffer(prev => ({ ...prev, start_date: date.toISOString() }));
    } else {
      setOffer(prev => ({ ...prev, start_date: undefined }));
    }
  };

  const handleExpirationDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setExpirationDateString(value);
    
    if (value) {
      // Append time to make a valid ISO string
      const date = new Date(`${value}T23:59:59`);
      setOffer(prev => ({ ...prev, expiration_date: date.toISOString() }));
    } else {
      setOffer(prev => ({ ...prev, expiration_date: undefined }));
    }
  };

  const addBenefit = (benefit: string) => {
    if (!benefit.trim()) return;
    
    setOffer(prev => {
      const currentBenefits = prev.benefits || [];
      return {
        ...prev,
        benefits: [...currentBenefits, benefit.trim()]
      };
    });
    
    setNewBenefit('');
  };

  const removeBenefit = (index: number) => {
    setOffer(prev => {
      const currentBenefits = prev.benefits || [];
      return {
        ...prev,
        benefits: currentBenefits.filter((_, i) => i !== index)
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!offer.position_title) newErrors['position_title'] = 'Position title is required';
    if (!offer.salary?.amount) newErrors['salary.amount'] = 'Salary amount is required';
    if (!offer.start_date) newErrors['start_date'] = 'Start date is required';
    if (!offer.expiration_date) newErrors['expiration_date'] = 'Expiration date is required';
    
    if (offer.start_date && offer.expiration_date && 
        new Date(offer.start_date) <= new Date(offer.expiration_date)) {
      newErrors['expiration_date'] = 'Expiration date must be before start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent, submitAction: 'save_draft' | 'submit_for_approval' = 'save_draft') => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      let finalOffer = { ...offer };
      
      // Set appropriate status based on submit action
      if (submitAction === 'submit_for_approval') {
        finalOffer.status = 'pending_approval';
        finalOffer.submitted_at = new Date().toISOString();
      } else {
        finalOffer.status = 'draft';
      }
      
      let savedOffer;
      if (isEditing) {
        savedOffer = await updateOffer(offerId!, finalOffer);
        toast({
          title: 'Offer Updated',
          description: submitAction === 'submit_for_approval' 
            ? 'The offer has been submitted for approval' 
            : 'The offer has been saved as a draft',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Ensure org_id, job_id, and candidate_id are set
        if (!finalOffer.org_id && application) {
          finalOffer.org_id = application.org_id;
        }
        
        if (!finalOffer.job_id && application) {
          finalOffer.job_id = application.job_id;
        }
        
        if (!finalOffer.candidate_id && application) {
          finalOffer.candidate_id = application.user_id;
        }
        
        savedOffer = await createOffer(finalOffer);
        toast({
          title: 'Offer Created',
          description: submitAction === 'submit_for_approval' 
            ? 'The offer has been submitted for approval' 
            : 'The offer has been saved as a draft',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      if (onSave) {
        onSave(savedOffer);
      } else if (application) {
        // Navigate back to the application detail page
        router.push(`/applications/${application.id}`);
      } else {
        // Navigate to the offer detail page
        router.push(`/offers/${savedOffer.id}`);
      }
    } catch (error) {
      console.error('Error saving offer:', error);
      toast({
        title: 'Error',
        description: isEditing ? 'Failed to update offer' : 'Failed to create offer',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={e => handleSubmit(e)} noValidate>
      <Stack spacing={8}>
        {/* Candidate and Job Information */}
        {(candidate || job) && (
          <Box>
            <Heading size="md" mb={4}>Offer Details</Heading>
            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
              {candidate && (
                <GridItem>
                  <Box 
                    border="1px" 
                    borderColor="gray.200" 
                    borderRadius="md" 
                    p={4}
                  >
                    <Heading size="sm" mb={2}>Candidate</Heading>
                    <Text fontWeight="bold">{candidate.full_name}</Text>
                    <Text fontSize="sm">{candidate.email}</Text>
                    {application && (
                      <HStack mt={2}>
                        <Badge colorScheme="blue">{application.status}</Badge>
                      </HStack>
                    )}
                  </Box>
                </GridItem>
              )}
              
              {job && (
                <GridItem>
                  <Box 
                    border="1px" 
                    borderColor="gray.200" 
                    borderRadius="md" 
                    p={4}
                  >
                    <Heading size="sm" mb={2}>Job</Heading>
                    <Text fontWeight="bold">{job.title}</Text>
                    <Text fontSize="sm">{job.department}</Text>
                    <HStack mt={2}>
                      <Badge>{job.type}</Badge>
                      <Badge>{job.location}</Badge>
                    </HStack>
                  </Box>
                </GridItem>
              )}
            </Grid>
          </Box>
        )}
        
        {/* Position Details */}
        <Box>
          <Heading size="md" mb={4}>Position Details</Heading>
          <FormControl isRequired isInvalid={!!errors['position_title']}>
            <FormLabel>Position Title</FormLabel>
            <Input
              name="position_title"
              value={offer.position_title}
              onChange={handleInputChange}
              placeholder="e.g. Senior Software Engineer"
            />
            <FormErrorMessage>{errors['position_title']}</FormErrorMessage>
          </FormControl>
        </Box>
        
        <Divider />
        
        {/* Compensation Details */}
        <Box>
          <Heading size="md" mb={4}>Compensation</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl isRequired isInvalid={!!errors['salary.amount']}>
                <FormLabel>Salary Amount</FormLabel>
                <NumberInput
                  min={0}
                  value={offer.salary?.amount}
                  onChange={(_, value) => handleNumberChange('salary.amount', value)}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors['salary.amount']}</FormErrorMessage>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Currency</FormLabel>
                <Select
                  name="salary.currency"
                  value={offer.salary?.currency}
                  onChange={handleInputChange}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="CAD">CAD</option>
                  <option value="AUD">AUD</option>
                  <option value="JPY">JPY</option>
                </Select>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Period</FormLabel>
                <Select
                  name="salary.period"
                  value={offer.salary?.period}
                  onChange={handleInputChange}
                >
                  <option value="yearly">Yearly</option>
                  <option value="monthly">Monthly</option>
                  <option value="hourly">Hourly</option>
                </Select>
              </FormControl>
            </GridItem>
            
            {/* Bonus */}
            <GridItem colSpan={{ base: 1, md: 3 }}>
              <FormControl mb={4}>
                <FormLabel>Bonus</FormLabel>
                <Flex gap={4} flexWrap="wrap">
                  <Box flexGrow={1}>
                    <FormLabel fontSize="sm">Amount</FormLabel>
                    <NumberInput
                      min={0}
                      value={(offer.bonus as any)?.amount || 0}
                      onChange={(_, value) => handleNumberChange('bonus.amount', value)}
                    >
                      <NumberInputField />
                    </NumberInput>
                  </Box>
                  
                  <Box width="150px">
                    <FormLabel fontSize="sm">Currency</FormLabel>
                    <Select
                      name="bonus.currency"
                      value={(offer.bonus as any)?.currency || 'USD'}
                      onChange={handleInputChange}
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </Select>
                  </Box>
                  
                  <Box flexGrow={1}>
                    <FormLabel fontSize="sm">Description</FormLabel>
                    <Input
                      name="bonus.description"
                      value={(offer.bonus as any)?.description || ''}
                      onChange={handleInputChange}
                      placeholder="e.g. Annual performance bonus"
                    />
                  </Box>
                </Flex>
              </FormControl>
            </GridItem>
            
            {/* Equity */}
            <GridItem colSpan={{ base: 1, md: 3 }}>
              <FormControl>
                <FormLabel>Equity</FormLabel>
                <Input
                  name="equity_description"
                  value={offer.equity ? `${offer.equity.amount} ${offer.equity.type}` : ''}
                  onChange={(e) => {
                    // For simplicity, store equity as a description string
                    // In a real app, you'd parse this or use separate fields
                    setOffer(prev => ({ ...prev, equity_description: e.target.value }));
                  }}
                  placeholder="e.g. 0.1% or 10,000 RSUs"
                />
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
        
        <Divider />
        
        {/* Dates */}
        <Box>
          <Heading size="md" mb={4}>Important Dates</Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl isRequired isInvalid={!!errors['start_date']}>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  value={startDateString}
                  onChange={handleStartDateChange}
                />
                <FormErrorMessage>{errors['start_date']}</FormErrorMessage>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl isRequired isInvalid={!!errors['expiration_date']}>
                <FormLabel>Offer Expiration Date</FormLabel>
                <Input
                  type="date"
                  value={expirationDateString}
                  onChange={handleExpirationDateChange}
                />
                <FormErrorMessage>{errors['expiration_date']}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>
        </Box>
        
        <Divider />
        
        {/* Benefits */}
        <Box>
          <Heading size="md" mb={4}>Benefits</Heading>
          
          <FormControl mb={6}>
            <Flex wrap="wrap" gap={2} mb={4}>
              {offer.benefits?.map((benefit, index) => (
                <Tag key={index} size="md" borderRadius="full" colorScheme="green">
                  <TagLabel>{benefit}</TagLabel>
                  <TagCloseButton onClick={() => removeBenefit(index)} />
                </Tag>
              ))}
              {!offer.benefits || offer.benefits.length === 0 && (
                <Text color="gray.500">No benefits added yet</Text>
              )}
            </Flex>
            
            <InputGroup>
              <Input
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="Add a benefit"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addBenefit(newBenefit);
                  }
                }}
              />
              <InputRightElement>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => addBenefit(newBenefit)}
                >
                  <AddIcon />
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          
          <Box>
            <Text mb={2} fontWeight="medium">Common Benefits</Text>
            <Flex wrap="wrap" gap={2}>
              {commonBenefits.map((benefit, index) => (
                <Tag 
                  key={index} 
                  size="md" 
                  borderRadius="full" 
                  variant="outline" 
                  colorScheme="green"
                  cursor="pointer"
                  _hover={{ bg: 'green.50' }}
                  onClick={() => {
                    if (!offer.benefits?.includes(benefit)) {
                      addBenefit(benefit);
                    }
                  }}
                >
                  <TagLabel>{benefit}</TagLabel>
                </Tag>
              ))}
            </Flex>
          </Box>
        </Box>
        
        <Divider />
        
        {/* Additional Notes */}
        <Box>
          <Heading size="md" mb={4}>Additional Information</Heading>
          <FormControl mb={4}>
            <FormLabel>Notes</FormLabel>
            <Textarea
              name="notes"
              value={offer.notes || ''}
              onChange={handleInputChange}
              placeholder="Any additional notes or special terms for this offer"
              rows={4}
            />
          </FormControl>
        </Box>
        
        {/* Action Buttons */}
        <Flex justify="space-between" pt={4}>
          <Button
            variant="outline"
            onClick={() => {
              if (application) {
                router.push(`/applications/${application.id}`);
              } else {
                router.push('/offers');
              }
            }}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          
          <HStack>
            <Button
              type="button"
              colorScheme="blue"
              variant="outline"
              onClick={(e) => handleSubmit(e, 'save_draft')}
              isLoading={isLoading}
            >
              Save as Draft
            </Button>
            
            <Button
              type="button"
              colorScheme="green"
              onClick={(e) => handleSubmit(e, 'submit_for_approval')}
              isLoading={isLoading}
            >
              Submit for Approval
            </Button>
          </HStack>
        </Flex>
      </Stack>
    </Box>
  );
};

export default OfferForm; 
