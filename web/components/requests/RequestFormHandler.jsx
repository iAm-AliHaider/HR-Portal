import React, { useState, useEffect } from "react";

import { useRouter } from "next/router";

import { Box, Spinner, Center, Text, useToast } from "@chakra-ui/react";

import { supabase } from "../../lib/supabase/client";

import LeaveRequestForm from "./LeaveRequestForm";

/**
 * RequestFormHandler component
 * Renders the appropriate form based on request type
 */
const RequestFormHandler = ({ requestType, onSubmit, onCancel }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSchema, setFormSchema] = useState(null);
  const [error, setError] = useState(null);
  const toast = useToast();
  const router = useRouter();

  // Fetch form schema for the given request type
  useEffect(() => {
    const fetchFormSchema = async () => {
      try {
        const { data, error } = await supabase
          .from("request_types")
          .select("form_schema, name")
          .eq("name", requestType)
          .single();

        if (error) throw error;

        setFormSchema(data.form_schema);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching form schema:", err);
        setError("Failed to load form schema. Please try again later.");
        setIsLoading(false);
      }
    };

    if (requestType) {
      fetchFormSchema();
    }
  }, [requestType]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Get the current user ID
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not authenticated");

      // Get the request type ID
      const { data: requestTypeData, error: requestTypeError } = await supabase
        .from("request_types")
        .select("id")
        .eq("name", formData.request_type || requestType)
        .single();

      if (requestTypeError) throw requestTypeError;

      // Submit the request
      const { data, error } = await supabase
        .from("requests")
        .insert({
          title: formData.title,
          description: formData.description,
          employee_id: user.id,
          request_type_id: requestTypeData.id,
          status: "pending",
          form_data: formData.form_data || formData,
        })
        .select()
        .single();

      if (error) throw error;

      setIsSubmitting(false);
      toast({
        title: "Request submitted",
        description: "Your request has been submitted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Redirect to the dashboard
      router.push("/employee/request-panel");
    } catch (err) {
      console.error("Error submitting request:", err);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Center h="200px">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="200px">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  // Render the appropriate form based on request type
  if (
    requestType === "Leave/Time-off Request" ||
    requestType === "Annual Leave Request" ||
    requestType === "Vacation Request" ||
    requestType === "Sick Leave"
  ) {
    return (
      <LeaveRequestForm
        onSubmit={handleSubmit}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
      />
    );
  }

  // Fallback to a dynamic form using the form schema
  return (
    <Box>
      <Text>Generic form for {requestType} will be rendered here</Text>
      {/* Implement a generic form builder using the formSchema */}
    </Box>
  );
};

export default RequestFormHandler;
