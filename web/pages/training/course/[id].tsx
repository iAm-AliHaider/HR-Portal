import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  useToast,
  Divider,
  SimpleGrid,
  Progress,
  Avatar,
  Flex,
  Spacer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Select,
  Checkbox,
  Textarea,
  Skeleton,
  SkeletonText,
  Alert,
  AlertIcon,
  List,
  ListItem,
  ListIcon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  IconButton,
  Tooltip,
  Link,
  useColorModeValue
} from '@chakra-ui/react';
import {
  ArrowBackIcon,
  CalendarIcon,
  TimeIcon,
  StarIcon,
  DownloadIcon,
  ViewIcon,
  CheckIcon,
  InfoIcon,
  ExternalLinkIcon
} from '@chakra-ui/icons';
import { format, parseISO } from 'date-fns';
import { TrainingService } from '../../../services/training';
import { BookingService } from '../../../services/booking';
import { 
  TrainingCourse,
  TrainingSession,
  TrainingEnrollment,
  Trainer,
  TrainingAssessment,
  TrainingCertificate
} from '../../../../packages/types/hr';
import {
  FaGraduationCap,
  FaUsers,
  FaClock,
  FaMapMarkerAlt,
  FaVideo,
  FaDownload,
  FaEye,
  FaCertificate,
  FaQuestionCircle,
  FaPlayCircle,
  FaBook,
  FaChartLine,
  FaTrophy,
  FaCalendarAlt
} from 'react-icons/fa';
import { GetServerSideProps } from 'next';

const CourseDetailsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pageRef = useRef<HTMLDivElement>(null);
  
  const [course, setCourse] = useState<TrainingCourse | null>(null);
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [assessments, setAssessments] = useState<TrainingAssessment[]>([]);
  const [certificates, setCertificates] = useState<TrainingCertificate[]>([]);
  const [enrollments, setEnrollments] = useState<TrainingEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [enrollmentType, setEnrollmentType] = useState<'self_enrolled' | 'manager_assigned'>('self_enrolled');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [enrollmentNotes, setEnrollmentNotes] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // Client-side check
  const isClient = typeof window !== 'undefined';
  
  useEffect(() => {
    if (id && typeof id === 'string') {
      loadCourseData(id);
    }
  }, [id]);

  // Preserve scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    // Add scroll event listener only on client side
    if (isClient) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Cleanup
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isClient]);

  // Restore scroll position after state updates
  useEffect(() => {
    if (isClient && scrollPosition > 0) {
      window.scrollTo(0, scrollPosition);
    }
  }, [isClient, course, sessions, assessments, certificates, enrollments, scrollPosition]);

  // Override browser's automatic scroll restoration
  useEffect(() => {
    if (isClient && 'scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
      
      return () => {
        if ('scrollRestoration' in history) {
          history.scrollRestoration = 'auto';
        }
      };
    }
  }, [isClient]);

  const loadCourseData = async (courseId: string) => {
    try {
      setLoading(true);
      const [courseData, sessionsData, assessmentsData, certificatesData, enrollmentsData] = await Promise.all([
        TrainingService.getCourse(courseId),
        TrainingService.getSessions('org1', { course_id: courseId }),
        TrainingService.getAssessments('org1', { course_id: courseId }),
        TrainingService.getCertificates('org1', { course_id: courseId }),
        TrainingService.getEnrollments('org1', { course_id: courseId })
      ]);

      setCourse(courseData);
      setSessions(sessionsData);
      setAssessments(assessmentsData);
      setCertificates(certificatesData);
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Error loading course data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load course details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!selectedSessionId) {
      toast({
        title: 'Session Required',
        description: 'Please select a session to enroll in',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: 'Terms Required',
        description: 'Please accept the terms and conditions',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setEnrolling(true);
      
      // Create enrollment
      await TrainingService.createEnrollment({
        org_id: 'org1',
        session_id: selectedSessionId,
        course_id: course!.id,
        user_id: 'current_user_id', // In real app, get from auth context
        enrollment_type: enrollmentType,
        enrollment_date: new Date().toISOString(),
        status: 'enrolled',
        notes: enrollmentNotes || undefined
      });

      // If session requires room booking, create booking
      const selectedSession = sessions.find(s => s.id === selectedSessionId);
      if (selectedSession && selectedSession.delivery_method !== 'virtual') {
        try {
          await BookingService.createRoomBooking({
            org_id: 'org1',
            room_id: 'room1', // In real app, let user select room
            booked_by: 'current_user_id',
            booking_type: 'training',
            related_record_id: selectedSessionId,
            title: `Training: ${course!.title}`,
            description: `Training session for ${course!.title}`,
            start_time: selectedSession.start_time,
            end_time: selectedSession.end_time,
            attendee_count: 1,
            status: 'confirmed'
          });
        } catch (bookingError) {
          console.warn('Room booking failed:', bookingError);
          // Continue with enrollment even if room booking fails
        }
      }

      toast({
        title: 'Enrolled Successfully',
        description: `You have been enrolled in ${course!.title}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      onClose();
      // Reload enrollment data
      const updatedEnrollments = await TrainingService.getEnrollments('org1', { course_id: course!.id });
      setEnrollments(updatedEnrollments);

    } catch (error) {
      console.error('Error enrolling in course:', error);
      toast({
        title: 'Enrollment Failed',
        description: 'There was an error enrolling in the course',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setEnrolling(false);
    }
  };

  const handleViewMaterial = (materialUrl: string) => {
    window.open(materialUrl, '_blank');
  };

  const handleDownloadMaterial = (materialUrl: string, fileName: string) => {
    // In a real app, this would handle secure download
    const link = document.createElement('a');
    link.href = materialUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Skeleton height="40px" />
          <SkeletonText noOfLines={3} spacing="4" />
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardBody>
                  <Skeleton height="120px" />
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    );
  }

  if (!course) {
    return (
      <Container maxW="7xl" py={8}>
        <Alert status="error">
          <AlertIcon />
          Course not found
        </Alert>
      </Container>
    );
  }

  const isEnrolled = enrollments.some(e => e.user_id === 'current_user_id' && e.status !== 'cancelled');
  const completedEnrollment = enrollments.find(e => e.user_id === 'current_user_id' && e.status === 'completed');

  return (
    <>
      <Head>
        <title>{course.title} - Training Portal</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>

      <Container maxW="7xl" py={8} ref={pageRef}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack spacing={4}>
            <IconButton
              aria-label="Back to training"
              icon={<ArrowBackIcon />}
              onClick={() => router.push('/training')}
              variant="ghost"
            />
            <Box flex={1}>
              <Heading size="lg" mb={2}>{course.title}</Heading>
              <HStack spacing={4}>
                <Badge colorScheme="blue">{course.type}</Badge>
                <Badge colorScheme="purple">{course.level}</Badge>
                <Badge colorScheme="green">{course.delivery_method}</Badge>
                {course.certification_awarded && (
                  <Badge colorScheme="orange">
                    <FaCertificate style={{ marginRight: '4px' }} />
                    Certification
                  </Badge>
                )}
              </HStack>
            </Box>
            <Button
              colorScheme="blue"
              onClick={onOpen}
              disabled={isEnrolled}
              leftIcon={<FaGraduationCap />}
            >
              {isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
            </Button>
          </HStack>

          {/* Course Stats */}
          <SimpleGrid columns={{ base: 1, md: 4 }} spacing={6}>
            <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <Box color="blue.500" fontSize="2xl">
                    <FaClock />
                  </Box>
                  <Text fontSize="2xl" fontWeight="bold">{course.duration_hours}h</Text>
                  <Text fontSize="sm" color="gray.600">Duration</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <Box color="green.500" fontSize="2xl">
                    <FaUsers />
                  </Box>
                  <Text fontSize="2xl" fontWeight="bold">{course.total_enrollments || 0}</Text>
                  <Text fontSize="sm" color="gray.600">Enrollments</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <Box color="yellow.500" fontSize="2xl">
                    <StarIcon />
                  </Box>
                  <Text fontSize="2xl" fontWeight="bold">{course.average_rating?.toFixed(1) || 'N/A'}</Text>
                  <Text fontSize="sm" color="gray.600">Rating</Text>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} border="1px solid" borderColor={borderColor}>
              <CardBody textAlign="center">
                <VStack spacing={2}>
                  <Box color="purple.500" fontSize="2xl">
                    <FaChartLine />
                  </Box>
                  <Text fontSize="2xl" fontWeight="bold">{course.completion_rate || 0}%</Text>
                  <Text fontSize="sm" color="gray.600">Completion</Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Main Content Tabs */}
          <Tabs>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Sessions ({sessions.length})</Tab>
              <Tab>Materials ({course.materials?.length || 0})</Tab>
              <Tab>Assessments ({assessments.length})</Tab>
              <Tab>Certificates ({certificates.length})</Tab>
            </TabList>

            <TabPanels>
              {/* Overview Tab */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
                  <VStack spacing={6} align="stretch">
                    <Card>
                      <CardHeader>
                        <Heading size="md">Course Description</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text>{course.description}</Text>
                      </CardBody>
                    </Card>

                    <Card>
                      <CardHeader>
                        <Heading size="md">Learning Objectives</Heading>
                      </CardHeader>
                      <CardBody>
                        <List spacing={2}>
                          {course.learning_objectives.map((objective, index) => (
                            <ListItem key={index}>
                              <ListIcon as={CheckIcon} color="green.500" />
                              {objective}
                            </ListItem>
                          ))}
                        </List>
                      </CardBody>
                    </Card>

                    {course.prerequisites && course.prerequisites.length > 0 && (
                      <Card>
                        <CardHeader>
                          <Heading size="md">Prerequisites</Heading>
                        </CardHeader>
                        <CardBody>
                          <List spacing={2}>
                            {course.prerequisites.map((prereq, index) => (
                              <ListItem key={index}>
                                <ListIcon as={InfoIcon} color="blue.500" />
                                {prereq}
                              </ListItem>
                            ))}
                          </List>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>

                  <VStack spacing={6} align="stretch">
                    <Card>
                      <CardHeader>
                        <Heading size="md">Course Outline</Heading>
                      </CardHeader>
                      <CardBody>
                        <Accordion defaultIndex={[0]} allowMultiple>
                          {course.course_outline.map((module, index) => (
                            <AccordionItem key={index}>
                              <AccordionButton>
                                <Box flex="1" textAlign="left">
                                  <Text fontWeight="medium">{module.module_title}</Text>
                                  <Text fontSize="sm" color="gray.600">
                                    {module.duration_minutes} minutes
                                  </Text>
                                </Box>
                                <AccordionIcon />
                              </AccordionButton>
                              <AccordionPanel pb={4}>
                                <Text mb={3}>{module.module_description}</Text>
                                <Text fontSize="sm" fontWeight="medium" mb={2}>Learning Outcomes:</Text>
                                <List spacing={1} ml={4}>
                                  {module.learning_outcomes.map((outcome, outcomeIndex) => (
                                    <ListItem key={outcomeIndex} fontSize="sm">
                                      <ListIcon as={CheckIcon} color="green.500" />
                                      {outcome}
                                    </ListItem>
                                  ))}
                                </List>
                              </AccordionPanel>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </CardBody>
                    </Card>

                    {course.target_audience && course.target_audience.length > 0 && (
                      <Card>
                        <CardHeader>
                          <Heading size="md">Target Audience</Heading>
                        </CardHeader>
                        <CardBody>
                          <List spacing={2}>
                            {course.target_audience.map((audience, index) => (
                              <ListItem key={index}>
                                <ListIcon as={FaUsers} color="purple.500" />
                                {audience}
                              </ListItem>
                            ))}
                          </List>
                        </CardBody>
                      </Card>
                    )}
                  </VStack>
                </SimpleGrid>
              </TabPanel>

              {/* Sessions Tab */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {sessions.map((session) => (
                    <Card key={session.id} border="1px solid" borderColor={borderColor}>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <HStack justify="space-between">
                            <Heading size="md">{session.title}</Heading>
                            <Badge colorScheme={session.status === 'scheduled' ? 'green' : 'gray'}>
                              {session.status}
                            </Badge>
                          </HStack>

                          <Text fontSize="sm" color="gray.600">{session.description}</Text>

                          <VStack spacing={2} align="stretch">
                            <HStack>
                              <CalendarIcon color="blue.500" />
                              <Text fontSize="sm">
                                {format(parseISO(session.start_time), 'PPP')}
                              </Text>
                            </HStack>
                            <HStack>
                              <TimeIcon color="blue.500" />
                              <Text fontSize="sm">
                                {format(parseISO(session.start_time), 'p')} - {format(parseISO(session.end_time), 'p')}
                              </Text>
                            </HStack>
                            {session.location && (
                              <HStack>
                                <FaMapMarkerAlt color="var(--chakra-colors-blue-500)" />
                                <Text fontSize="sm">{session.location}</Text>
                              </HStack>
                            )}
                            {session.virtual_meeting_url && (
                              <HStack>
                                <FaVideo color="var(--chakra-colors-blue-500)" />
                                <Text fontSize="sm">Virtual Session</Text>
                              </HStack>
                            )}
                          </VStack>

                          <Flex align="center">
                            <Text fontSize="sm" color="gray.600">
                              {session.current_enrollment}/{session.max_participants} enrolled
                            </Text>
                            <Spacer />
                            <Progress 
                              value={(session.current_enrollment / session.max_participants) * 100} 
                              width="100px" 
                              size="sm"
                              colorScheme="blue"
                            />
                          </Flex>

                          {session.trainer && (
                            <HStack>
                              <Avatar size="sm" src={session.trainer.profile_image_url} name={`${session.trainer.first_name} ${session.trainer.last_name}`} />
                              <VStack spacing={0} align="start">
                                <Text fontSize="sm" fontWeight="medium">
                                  {session.trainer.first_name} {session.trainer.last_name}
                                </Text>
                                <Text fontSize="xs" color="gray.600">{session.trainer.type} trainer</Text>
                              </VStack>
                            </HStack>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </TabPanel>

              {/* Materials Tab */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {course.materials?.map((material, index) => (
                    <Card key={index} border="1px solid" borderColor={borderColor}>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <HStack justify="space-between">
                            <Box flex={1}>
                              <Text fontWeight="medium" mb={1}>{material.title}</Text>
                              <Text fontSize="sm" color="gray.600">{material.description}</Text>
                            </Box>
                            <Badge colorScheme={material.is_required ? 'red' : 'gray'}>
                              {material.is_required ? 'Required' : 'Optional'}
                            </Badge>
                          </HStack>

                          <HStack>
                            <Box color="blue.500">
                              {material.type === 'document' && <FaBook />}
                              {material.type === 'video' && <FaPlayCircle />}
                              {material.type === 'presentation' && <FaEye />}
                            </Box>
                            <Text fontSize="sm" color="gray.600" textTransform="capitalize">
                              {material.type}
                            </Text>
                            {material.duration_minutes && (
                              <>
                                <Text fontSize="sm" color="gray.400">•</Text>
                                <Text fontSize="sm" color="gray.600">
                                  {material.duration_minutes} min
                                </Text>
                              </>
                            )}
                          </HStack>

                          <HStack spacing={2}>
                            <Button 
                              size="sm" 
                              leftIcon={<ViewIcon />}
                              onClick={() => handleViewMaterial(material.url)}
                              variant="outline"
                              flex={1}
                            >
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              leftIcon={<DownloadIcon />}
                              onClick={() => handleDownloadMaterial(material.url, material.title)}
                              variant="outline"
                              flex={1}
                            >
                              Download
                            </Button>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>
                  )) || (
                    <Text color="gray.600">No materials available for this course.</Text>
                  )}
                </SimpleGrid>
              </TabPanel>

              {/* Assessments Tab */}
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {assessments.map((assessment) => (
                    <Card key={assessment.id} border="1px solid" borderColor={borderColor}>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <HStack justify="space-between">
                            <Heading size="md">{assessment.title}</Heading>
                            <Badge colorScheme={assessment.is_mandatory ? 'red' : 'blue'}>
                              {assessment.is_mandatory ? 'Required' : 'Optional'}
                            </Badge>
                          </HStack>

                          <Text fontSize="sm" color="gray.600">{assessment.description}</Text>

                          <VStack spacing={2} align="stretch">
                            <HStack justify="space-between">
                              <Text fontSize="sm">Type:</Text>
                              <Text fontSize="sm" fontWeight="medium" textTransform="capitalize">
                                {assessment.type.replace('_', ' ')}
                              </Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="sm">Format:</Text>
                              <Text fontSize="sm" fontWeight="medium" textTransform="capitalize">
                                {assessment.format.replace('_', ' ')}
                              </Text>
                            </HStack>
                            {assessment.duration_minutes && (
                              <HStack justify="space-between">
                                <Text fontSize="sm">Duration:</Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {assessment.duration_minutes} minutes
                                </Text>
                              </HStack>
                            )}
                            <HStack justify="space-between">
                              <Text fontSize="sm">Passing Score:</Text>
                              <Text fontSize="sm" fontWeight="medium">
                                {assessment.passing_score}%
                              </Text>
                            </HStack>
                            <HStack justify="space-between">
                              <Text fontSize="sm">Max Attempts:</Text>
                              <Text fontSize="sm" fontWeight="medium">
                                {assessment.max_attempts}
                              </Text>
                            </HStack>
                          </VStack>

                          {isEnrolled && (
                            <Button 
                              leftIcon={<FaQuestionCircle />}
                              variant="outline"
                              size="sm"
                            >
                              Take Assessment
                            </Button>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </TabPanel>

              {/* Certificates Tab */}
              <TabPanel>
                {completedEnrollment && course.certification_awarded ? (
                  <VStack spacing={6} align="stretch">
                    <Alert status="success">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="bold">Certificate Available!</Text>
                        <Text fontSize="sm">You have successfully completed this course and earned a certificate.</Text>
                      </Box>
                    </Alert>

                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      {certificates.filter(cert => cert.user_id === 'current_user_id').map((certificate) => (
                        <Card key={certificate.id} border="1px solid" borderColor="green.200" bg="green.50">
                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              <HStack>
                                <Box color="green.500" fontSize="2xl">
                                  <FaTrophy />
                                </Box>
                                <VStack align="start" spacing={0} flex={1}>
                                  <Text fontWeight="bold">{certificate.title}</Text>
                                  <Text fontSize="sm" color="gray.600">
                                    Certificate #{certificate.certificate_number}
                                  </Text>
                                </VStack>
                              </HStack>

                              <VStack spacing={2} align="stretch">
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Issued:</Text>
                                  <Text fontSize="sm" fontWeight="medium">
                                    {format(parseISO(certificate.issue_date), 'PPP')}
                                  </Text>
                                </HStack>
                                {certificate.expiry_date && (
                                  <HStack justify="space-between">
                                    <Text fontSize="sm">Expires:</Text>
                                    <Text fontSize="sm" fontWeight="medium">
                                      {format(parseISO(certificate.expiry_date), 'PPP')}
                                    </Text>
                                  </HStack>
                                )}
                                <HStack justify="space-between">
                                  <Text fontSize="sm">Status:</Text>
                                  <Badge colorScheme={certificate.status === 'active' ? 'green' : 'red'}>
                                    {certificate.status}
                                  </Badge>
                                </HStack>
                              </VStack>

                              <HStack spacing={2}>
                                {certificate.certificate_url && (
                                  <Button 
                                    size="sm" 
                                    leftIcon={<DownloadIcon />}
                                    colorScheme="green"
                                    onClick={() => window.open(certificate.certificate_url, '_blank')}
                                    flex={1}
                                  >
                                    Download
                                  </Button>
                                )}
                                {certificate.verification_url && (
                                  <Button 
                                    size="sm" 
                                    leftIcon={<ExternalLinkIcon />}
                                    variant="outline"
                                    onClick={() => window.open(certificate.verification_url, '_blank')}
                                    flex={1}
                                  >
                                    Verify
                                  </Button>
                                )}
                              </HStack>
                            </VStack>
                          </CardBody>
                        </Card>
                      ))}
                    </SimpleGrid>
                  </VStack>
                ) : course.certification_awarded ? (
                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold">Certificate Available Upon Completion</Text>
                      <Text fontSize="sm">Complete this course to earn a certificate of completion.</Text>
                    </Box>
                  </Alert>
                ) : (
                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold">No Certificate</Text>
                      <Text fontSize="sm">This course does not award a certificate upon completion.</Text>
                    </Box>
                  </Alert>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>

        {/* Enrollment Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Enroll in {course.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6} align="stretch">
                <FormControl>
                  <FormLabel>Select Session</FormLabel>
                  <Select 
                    placeholder="Choose a session"
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                  >
                    {sessions
                      .filter(session => session.status === 'scheduled')
                      .map((session) => (
                        <option key={session.id} value={session.id}>
                          {format(parseISO(session.start_time), 'PPP p')} - {session.title}
                          {session.current_enrollment >= session.max_participants && ' (Full)'}
                        </option>
                      ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Enrollment Type</FormLabel>
                  <Select 
                    value={enrollmentType}
                    onChange={(e) => setEnrollmentType(e.target.value as 'self_enrolled' | 'manager_assigned')}
                  >
                    <option value="self_enrolled">Self Enrolled</option>
                    <option value="manager_assigned">Manager Assigned</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Notes (Optional)</FormLabel>
                  <Textarea 
                    placeholder="Any additional notes or requirements..."
                    value={enrollmentNotes}
                    onChange={(e) => setEnrollmentNotes(e.target.value)}
                  />
                </FormControl>

                <Checkbox 
                  isChecked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                >
                  I accept the terms and conditions for this training
                </Checkbox>

                {course.cost_per_participant && (
                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <Text fontWeight="bold">Course Fee</Text>
                      <Text fontSize="sm">${course.cost_per_participant} per participant</Text>
                    </Box>
                  </Alert>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleEnroll}
                isLoading={enrolling}
                loadingText="Enrolling..."
              >
                Enroll
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
};


// Force Server-Side Rendering to prevent static generation
export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {}
  };
};


export default CourseDetailsPage; 