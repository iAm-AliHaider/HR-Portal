import React, { useState, useEffect } from "react";

import { CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  FormLabel,
  Select,
  VStack,
  HStack,
  Text,
  Badge,
  Checkbox,
  CheckboxGroup,
  Alert,
  AlertIcon,
  Spinner,
  Divider,
  Button,
  useToast,
  Stack,
} from "@chakra-ui/react";

import { MeetingRoom, Asset } from "../../../packages/types/hr";
import {
  getAvailableRoomsForInterview,
  getAvailableAssetsForInterview,
} from "../../services/interviews";

interface InterviewBookingSectionProps {
  interviewType: string;
  scheduledAt: string;
  duration: number;
  orgId: string;
  selectedRoomId?: string;
  selectedAssetIds?: string[];
  onRoomChange: (roomId: string | undefined) => void;
  onAssetsChange: (assetIds: string[]) => void;
}

const InterviewBookingSection: React.FC<InterviewBookingSectionProps> = ({
  interviewType,
  scheduledAt,
  duration,
  orgId,
  selectedRoomId,
  selectedAssetIds = [],
  onRoomChange,
  onAssetsChange,
}) => {
  const toast = useToast();
  const [availableRooms, setAvailableRooms] = useState<
    Array<{ room: MeetingRoom; available: boolean }>
  >([]);
  const [availableAssets, setAvailableAssets] = useState<
    Array<{ asset: Asset; available: boolean }>
  >([]);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [showBookingOptions, setShowBookingOptions] = useState(
    interviewType === "in_person",
  );

  useEffect(() => {
    setShowBookingOptions(interviewType === "in_person");
    if (interviewType !== "in_person") {
      onRoomChange(undefined);
      onAssetsChange([]);
    }
  }, [interviewType, onRoomChange, onAssetsChange]);

  useEffect(() => {
    if (showBookingOptions && scheduledAt && duration) {
      loadAvailableRooms();
      loadAvailableAssets();
    }
  }, [showBookingOptions, scheduledAt, duration, orgId]);

  const loadAvailableRooms = async () => {
    if (!scheduledAt || !duration) return;

    setIsLoadingRooms(true);
    try {
      const startTime = new Date(scheduledAt);
      const endTime = new Date(startTime.getTime() + duration * 60000);

      const roomsData = await getAvailableRoomsForInterview(
        orgId,
        startTime.toISOString(),
        endTime.toISOString(),
        2, // Minimum capacity for interviews
      );

      setAvailableRooms(roomsData);
    } catch (error) {
      console.error("Error loading available rooms:", error);
      toast({
        title: "Error",
        description: "Failed to load available meeting rooms",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const loadAvailableAssets = async () => {
    if (!scheduledAt || !duration) return;

    setIsLoadingAssets(true);
    try {
      const startTime = new Date(scheduledAt);
      const endTime = new Date(startTime.getTime() + duration * 60000);

      const assetsData = await getAvailableAssetsForInterview(
        orgId,
        startTime.toISOString(),
        endTime.toISOString(),
      );

      setAvailableAssets(assetsData);
    } catch (error) {
      console.error("Error loading available assets:", error);
      toast({
        title: "Error",
        description: "Failed to load available assets",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const handleRoomSelection = (roomId: string) => {
    onRoomChange(roomId === "" ? undefined : roomId);
  };

  const handleAssetSelection = (assetIds: string[]) => {
    onAssetsChange(assetIds);
  };

  if (!showBookingOptions) {
    return (
      <Alert status="info">
        <AlertIcon />
        <Text fontSize="sm">
          Room and asset booking is only available for in-person interviews.
        </Text>
      </Alert>
    );
  }

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <HStack mb={3}>
            <CalendarIcon color="blue.500" />
            <Text fontWeight="semibold" color="blue.600">
              Meeting Room Booking
            </Text>
          </HStack>

          {isLoadingRooms ? (
            <HStack>
              <Spinner size="sm" />
              <Text fontSize="sm" color="gray.500">
                Loading available rooms...
              </Text>
            </HStack>
          ) : (
            <FormControl>
              <FormLabel fontSize="sm">
                Select Meeting Room (Optional)
              </FormLabel>
              <Select
                placeholder="No room booking required"
                value={selectedRoomId || ""}
                onChange={(e) => handleRoomSelection(e.target.value)}
                size="md"
              >
                {availableRooms.map(({ room, available }) => (
                  <option key={room.id} value={room.id} disabled={!available}>
                    {room.name} - {room.location} (Capacity: {room.capacity})
                    {!available && " - Unavailable"}
                  </option>
                ))}
              </Select>
              {availableRooms.length === 0 && (
                <Text fontSize="xs" color="orange.500" mt={1}>
                  No meeting rooms found. Please check the scheduled time or
                  contact admin.
                </Text>
              )}
            </FormControl>
          )}

          {selectedRoomId && (
            <Box
              mt={3}
              p={3}
              bg="blue.50"
              borderRadius="md"
              border="1px"
              borderColor="blue.200"
            >
              {(() => {
                const selectedRoom = availableRooms.find(
                  (r) => r.room.id === selectedRoomId,
                )?.room;
                if (!selectedRoom) return null;

                return (
                  <VStack align="start" spacing={2}>
                    <HStack>
                      <Badge colorScheme="blue">Selected Room</Badge>
                      <Text fontWeight="semibold">{selectedRoom.name}</Text>
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      📍 {selectedRoom.location}
                      {selectedRoom.building && ` - ${selectedRoom.building}`}
                      {selectedRoom.floor && `, Floor ${selectedRoom.floor}`}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      👥 Capacity: {selectedRoom.capacity} people
                    </Text>
                    {selectedRoom.equipment &&
                      selectedRoom.equipment.length > 0 && (
                        <Text fontSize="sm" color="gray.600">
                          🔧 Equipment: {selectedRoom.equipment.join(", ")}
                        </Text>
                      )}
                    {selectedRoom.video_conference_enabled && (
                      <Badge colorScheme="green" size="sm">
                        Video Conference Enabled
                      </Badge>
                    )}
                  </VStack>
                );
              })()}
            </Box>
          )}
        </Box>

        <Divider />

        <Box>
          <HStack mb={3}>
            <TimeIcon color="green.500" />
            <Text fontWeight="semibold" color="green.600">
              Equipment Booking
            </Text>
          </HStack>

          {isLoadingAssets ? (
            <HStack>
              <Spinner size="sm" />
              <Text fontSize="sm" color="gray.500">
                Loading available equipment...
              </Text>
            </HStack>
          ) : (
            <FormControl>
              <FormLabel fontSize="sm">Select Equipment (Optional)</FormLabel>
              <CheckboxGroup
                value={selectedAssetIds}
                onChange={handleAssetSelection}
              >
                <Stack spacing={3}>
                  {availableAssets
                    .filter(({ available }) => available)
                    .map(({ asset }) => (
                      <Checkbox key={asset.id} value={asset.id}>
                        <VStack align="start" spacing={1} ml={2}>
                          <HStack>
                            <Text fontWeight="medium">{asset.name}</Text>
                            <Badge colorScheme="gray" size="sm">
                              {asset.category}
                            </Badge>
                          </HStack>
                          {asset.description && (
                            <Text fontSize="xs" color="gray.500">
                              {asset.description}
                            </Text>
                          )}
                          {asset.location && (
                            <Text fontSize="xs" color="gray.500">
                              📍 Located at: {asset.location}
                            </Text>
                          )}
                        </VStack>
                      </Checkbox>
                    ))}
                </Stack>
              </CheckboxGroup>

              {availableAssets.filter(({ available }) => available).length ===
                0 && (
                <Text fontSize="xs" color="gray.500" mt={1}>
                  No equipment available for booking at this time.
                </Text>
              )}

              {availableAssets.filter(({ available }) => !available).length >
                0 && (
                <Box
                  mt={3}
                  p={2}
                  bg="orange.50"
                  borderRadius="md"
                  border="1px"
                  borderColor="orange.200"
                >
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="orange.700"
                    mb={1}
                  >
                    Unavailable Equipment:
                  </Text>
                  {availableAssets
                    .filter(({ available }) => !available)
                    .map(({ asset }) => (
                      <Text key={asset.id} fontSize="xs" color="orange.600">
                        • {asset.name} ({asset.category})
                      </Text>
                    ))}
                </Box>
              )}
            </FormControl>
          )}

          {selectedAssetIds.length > 0 && (
            <Box
              mt={3}
              p={3}
              bg="green.50"
              borderRadius="md"
              border="1px"
              borderColor="green.200"
            >
              <HStack mb={2}>
                <Badge colorScheme="green">Selected Equipment</Badge>
                <Text fontSize="sm" fontWeight="medium">
                  {selectedAssetIds.length} item(s)
                </Text>
              </HStack>
              <VStack align="start" spacing={1}>
                {selectedAssetIds.map((assetId) => {
                  const asset = availableAssets.find(
                    (a) => a.asset.id === assetId,
                  )?.asset;
                  if (!asset) return null;
                  return (
                    <Text key={assetId} fontSize="sm" color="gray.600">
                      • {asset.name} ({asset.category})
                    </Text>
                  );
                })}
              </VStack>
            </Box>
          )}
        </Box>

        <Alert status="info" size="sm">
          <AlertIcon />
          <VStack align="start" spacing={1}>
            <Text fontSize="sm">
              <strong>Booking Notes:</strong>
            </Text>
            <Text fontSize="xs">
              • Room and equipment will be automatically booked when the
              interview is scheduled
            </Text>
            <Text fontSize="xs">
              • You'll receive confirmation emails with booking details
            </Text>
            <Text fontSize="xs">
              • Equipment must be checked out from the specified location before
              the interview
            </Text>
          </VStack>
        </Alert>
      </VStack>
    </Box>
  );
};

export default InterviewBookingSection;
