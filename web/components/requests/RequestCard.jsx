import React from "react";

import {
  Box,
  HStack,
  Text,
  Badge,
  Icon,
  Flex,
  IconButton,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  VStack,
  Divider,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { FiFileText, FiClock, FiCheck, FiX, FiEye } from "react-icons/fi";

/**
 * Component to display a request card in the request panel
 */
const RequestCard = ({ request }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Determine status color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "yellow";
      case "approved":
        return "green";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return FiClock;
      case "approved":
        return FiCheck;
      case "rejected":
        return FiX;
      default:
        return FiFileText;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Render form data in the modal
  const renderFormData = () => {
    if (!request.form_data) return null;

    return Object.entries(request.form_data).map(([key, value]) => {
      // Skip internal fields or empty values
      if (key === "id" || key === "employee_id" || !value) return null;

      // Format the key for display
      const formattedKey = key
        .replace(/([A-Z])/g, " $1") // Add space before capital letters
        .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter

      // Format dates
      if (key.toLowerCase().includes("date") && value) {
        try {
          value = formatDate(value);
        } catch (e) {
          // Keep original value if date parsing fails
        }
      }

      return (
        <Box key={key} mb={2}>
          <Text fontWeight="bold" fontSize="sm" color="gray.600">
            {formattedKey}
          </Text>
          <Text>{value.toString()}</Text>
        </Box>
      );
    });
  };

  return (
    <>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        shadow="sm"
        _hover={{ shadow: "md" }}
        transition="all 0.2s"
      >
        <HStack justify="space-between">
          <HStack spacing={4}>
            <Icon as={FiFileText} boxSize={5} color="blue.500" />
            <Box>
              <Text fontWeight="bold">{request.title}</Text>
              <Text fontSize="sm" color="gray.600">
                {request.request_types?.name || "Request"} •{" "}
                {formatDate(request.created_at)}
              </Text>
            </Box>
          </HStack>
          <HStack>
            <Badge
              colorScheme={getStatusColor(request.status)}
              display="flex"
              alignItems="center"
            >
              <Icon as={getStatusIcon(request.status)} mr={1} />
              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
            </Badge>
            <Tooltip label="View Details">
              <IconButton
                icon={<FiEye />}
                size="sm"
                variant="ghost"
                aria-label="View details"
                onClick={onOpen}
              />
            </Tooltip>
          </HStack>
        </HStack>
      </Box>

      {/* Request Details Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Flex align="center">
              <Icon as={FiFileText} mr={2} color="blue.500" />
              {request.title}
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack align="stretch" spacing={4}>
              <HStack>
                <Badge
                  colorScheme={getStatusColor(request.status)}
                  px={2}
                  py={1}
                >
                  <Flex align="center">
                    <Icon as={getStatusIcon(request.status)} mr={1} />
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </Flex>
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  Submitted on {formatDate(request.created_at)}
                </Text>
              </HStack>

              <Box>
                <Text fontWeight="bold">Request Type</Text>
                <Text>{request.request_types?.name || "Unknown"}</Text>
              </Box>

              <Box>
                <Text fontWeight="bold">Description</Text>
                <Text>{request.description}</Text>
              </Box>

              <Divider />

              <Text fontWeight="bold">Request Details</Text>
              {renderFormData()}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default RequestCard;
