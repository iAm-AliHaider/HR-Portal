import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  FormErrorMessage,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { supabase } from '../../lib/supabase/client';
import SelectField from '../ui/SelectField';

/**
 * LeaveRequestForm component
 * A specialized form for leave requests that properly handles the form fields
 */
const LeaveRequestForm = ({ onSubmit, onCancel, isSubmitting }) => {
  const toast = useToast();
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [formData, setFormData] = useState({
    leaveType: 'Annual Leave', // Set default value to prevent validation error
    startDate: '',
    endDate: '',
    totalDays: 1,
    reason: '',
    handoverNotes: '',
  });
  const [errors, setErrors] = useState({});

  // Fetch leave types from the database
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('leave_types')
          .select('name')
          .order('name');

        if (error) throw error;
        
        const types = data.map(type => type.name);
        setLeaveTypes(types);
      } catch (error) {
        console.error('Error fetching leave types:', error);
        // Fallback to default types if fetch fails
        setLeaveTypes([
          'Annual Leave',
          'Sick Leave',
          'Personal Leave',
          'Bereavement Leave',
          'Study Leave',
          'Maternity Leave',
          'Paternity Leave'
        ]);
      }
    };

    fetchLeaveTypes();
    
    // Clear any initial errors after a short delay
    const timer = setTimeout(() => {
      setErrors({});
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate days between dates
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      
      // Check if dates are valid
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        // Calculate business days (excluding weekends)
        let days = 0;
        const currentDate = new Date(start);
        const endDate = new Date(end);
        
        while (currentDate <= endDate) {
          const dayOfWeek = currentDate.getDay();
          if (dayOfWeek !== 0 && dayOfWeek !== 6) {
            days++;
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        setFormData(prev => ({ ...prev, totalDays: days }));
      }
    }
  }, [formData.startDate, formData.endDate]);

  // Handle form field changes
  const handleChange = (field, value) => {
    console.log(`Updating ${field} to:`, value); // Add debug logging
    
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      console.log('New form data:', newData); // Log the updated form data
      return newData;
    });
    
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle leave type selection specifically
  const handleLeaveTypeChange = (value) => {
    console.log('Leave type selected:', value);
    handleChange('leaveType', value);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.leaveType) {
      newErrors.leaveType = 'Leave type is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'End date cannot be before start date';
    }
    
    if (!formData.totalDays || formData.totalDays <= 0) {
      newErrors.totalDays = 'Total days must be greater than 0';
    }
    
    if (!formData.reason) {
      newErrors.reason = 'Reason is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);
    
    if (validateForm()) {
      // Form is valid, submit data
      onSubmit({
        title: `${formData.leaveType} Request`,
        description: formData.reason,
        form_data: formData,
        request_type: 'Leave/Time-off Request'
      });
    } else {
      toast({
        title: 'Form validation error',
        description: 'Please fill in all required fields correctly.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Immediately clear the error when leaveType has a value
  useEffect(() => {
    if (formData.leaveType && errors.leaveType) {
      setErrors(prev => ({ ...prev, leaveType: undefined }));
    }
  }, [formData.leaveType, errors.leaveType]);

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={4} align="stretch">
        <Heading size="md">New Leave/Time-off Request</Heading>
        
        <SelectField
          name="leaveType"
          label="Leave Type"
          options={leaveTypes}
          value={formData.leaveType}
          onChange={handleLeaveTypeChange}
          isRequired
          error={errors.leaveType}
        />
        
        <FormControl isInvalid={!!errors.startDate} isRequired>
          <FormLabel>Start Date</FormLabel>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => handleChange('startDate', e.target.value)}
          />
          {errors.startDate && <FormErrorMessage>{errors.startDate}</FormErrorMessage>}
        </FormControl>
        
        <FormControl isInvalid={!!errors.endDate} isRequired>
          <FormLabel>End Date</FormLabel>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => handleChange('endDate', e.target.value)}
          />
          {errors.endDate && <FormErrorMessage>{errors.endDate}</FormErrorMessage>}
        </FormControl>
        
        <FormControl isInvalid={!!errors.totalDays} isRequired>
          <FormLabel>Total Days</FormLabel>
          <NumberInput 
            min={0.5} 
            step={0.5} 
            value={formData.totalDays}
            onChange={(value) => handleChange('totalDays', parseFloat(value))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          {errors.totalDays && <FormErrorMessage>{errors.totalDays}</FormErrorMessage>}
        </FormControl>
        
        <FormControl isInvalid={!!errors.reason} isRequired>
          <FormLabel>Reason</FormLabel>
          <Textarea
            value={formData.reason}
            onChange={(e) => handleChange('reason', e.target.value)}
            rows={3}
          />
          {errors.reason && <FormErrorMessage>{errors.reason}</FormErrorMessage>}
        </FormControl>
        
        <FormControl>
          <FormLabel>Handover Notes</FormLabel>
          <Textarea
            value={formData.handoverNotes}
            onChange={(e) => handleChange('handoverNotes', e.target.value)}
            rows={3}
            placeholder="Optional: Enter any handover notes for your team during your absence"
          />
        </FormControl>
        
        <HStack spacing={4} justify="flex-end" pt={4}>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting}>
            Submit Request
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default LeaveRequestForm; 