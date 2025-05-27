import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
  Grid,
  GridItem,
  Avatar,
  Badge,
  Link,
  Button,
  Icon,
  Stack,
  HStack,
  VStack,
  Divider,
  Card,
  CardHeader,
  CardBody,
  useColorModeValue,
  List,
  ListItem,
  Tag
} from '@chakra-ui/react';
import { ExternalLinkIcon, EmailIcon, PhoneIcon, CalendarIcon, EditIcon } from '@chakra-ui/icons';
import { User, Education, Experience } from '../../../packages/types';
import { formatDistanceToNow } from 'date-fns';

interface CandidateProfileProps {
  candidate: User;
  isEditable?: boolean;
  onEdit?: () => void;
}

const CandidateProfile = ({ candidate, isEditable = false, onEdit }: CandidateProfileProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const sectionBg = useColorModeValue('white', 'gray.800');

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getYearsOfExperience = () => {
    if (!candidate.experience || candidate.experience.length === 0) return null;
    
    let totalMonths = 0;
    candidate.experience.forEach((exp) => {
      const startDate = new Date(exp.start_date);
      const endDate = exp.end_date ? new Date(exp.end_date) : new Date();
      const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                    (endDate.getMonth() - startDate.getMonth());
      totalMonths += months;
    });
    
    const years = Math.floor(totalMonths / 12);
    return years > 0 ? `${years}` : null;
  };

  const getLatestEducation = (): Education | null => {
    if (!candidate.education || candidate.education.length === 0) return null;
    
    return candidate.education.sort((a, b) => {
      const dateA = new Date(a.end_date || a.start_date);
      const dateB = new Date(b.end_date || b.start_date);
      return dateB.getTime() - dateA.getTime();
    })[0];
  };

  const getLatestExperience = (): Experience | null => {
    if (!candidate.experience || candidate.experience.length === 0) return null;
    
    return candidate.experience.sort((a, b) => {
      const dateA = new Date(a.end_date || '9999-12-31');
      const dateB = new Date(b.end_date || '9999-12-31');
      return dateB.getTime() - dateA.getTime();
    })[0];
  };

  const yearsOfExperience = getYearsOfExperience();
  const latestEducation = getLatestEducation();
  const latestExperience = getLatestExperience();

  return (
    <Box>
      {/* Header with profile info */}
      <Flex 
        direction={{ base: "column", md: "row" }} 
        align={{ base: "center", md: "flex-start" }}
        justify="space-between"
        mb={8}
        p={6}
        bg={sectionBg}
        borderRadius="lg"
        boxShadow="sm"
      >
        <Flex direction={{ base: "column", md: "row" }} align="center" gap={4}>
          <Avatar 
            size="xl" 
            name={candidate.full_name} 
            src={candidate.avatar_url}
          />
          <Box textAlign={{ base: "center", md: "left" }}>
            <Heading size="lg">{candidate.full_name}</Heading>
            <Text color="gray.600" fontSize="lg">
              {candidate.position || latestExperience?.position || 'Candidate'}
            </Text>
            <HStack spacing={4} mt={2} wrap="wrap" justify={{ base: "center", md: "flex-start" }}>
              <Flex align="center">
                <EmailIcon mr={1} />
                <Text>{candidate.email}</Text>
              </Flex>
              {candidate.phone && (
                <Flex align="center">
                  <PhoneIcon mr={1} />
                  <Text>{candidate.phone}</Text>
                </Flex>
              )}
            </HStack>
          </Box>
        </Flex>
        
        {isEditable && (
          <Button
            leftIcon={<EditIcon />}
            colorScheme="blue"
            variant="outline"
            onClick={onEdit}
            mt={{ base: 4, md: 0 }}
          >
            Edit Profile
          </Button>
        )}
      </Flex>

      {/* Main content in two columns */}
      <Grid templateColumns={{ base: "1fr", lg: "3fr 2fr" }} gap={8}>
        <GridItem>
          {/* Experience section */}
          {candidate.experience && candidate.experience.length > 0 && (
            <Card mb={6} boxShadow="sm" bg={sectionBg}>
              <CardHeader pb={0}>
                <Heading size="md">Experience</Heading>
                {yearsOfExperience && (
                  <Text color="gray.600" fontSize="sm">
                    {yearsOfExperience} years total
                  </Text>
                )}
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {candidate.experience.map((exp, index) => (
                    <Box 
                      key={index}
                      pb={4}
                      borderBottom={index < candidate.experience!.length - 1 ? `1px solid ${borderColor}` : undefined}
                    >
                      <Flex justify="space-between" wrap="wrap">
                        <Box>
                          <Heading size="sm">{exp.position}</Heading>
                          <Text fontWeight="medium">{exp.company}</Text>
                        </Box>
                        <Box textAlign={{ base: "left", sm: "right" }} mt={{ base: 1, sm: 0 }}>
                          <Text fontSize="sm" color="gray.600">
                            {formatDate(exp.start_date)} - {exp.end_date ? formatDate(exp.end_date) : 'Present'}
                          </Text>
                          {exp.location && (
                            <Text fontSize="sm">
                              {exp.location}
                            </Text>
                          )}
                        </Box>
                      </Flex>
                      {exp.description && (
                        <Text mt={2} fontSize="sm">
                          {exp.description}
                        </Text>
                      )}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <Box mt={2}>
                          <Text fontSize="sm" fontWeight="medium">Key Achievements:</Text>
                          <List spacing={1} mt={1}>
                            {exp.achievements.map((achievement, idx) => (
                              <ListItem key={idx} fontSize="sm">
                                • {achievement}
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      )}
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          )}
          
          {/* Education section */}
          {candidate.education && candidate.education.length > 0 && (
            <Card mb={6} boxShadow="sm" bg={sectionBg}>
              <CardHeader pb={0}>
                <Heading size="md">Education</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4} align="stretch">
                  {candidate.education.map((edu, index) => (
                    <Box
                      key={index}
                      pb={4}
                      borderBottom={index < candidate.education!.length - 1 ? `1px solid ${borderColor}` : undefined}
                    >
                      <Flex justify="space-between" wrap="wrap">
                        <Box>
                          <Heading size="sm">{edu.degree}</Heading>
                          <Text fontWeight="medium">{edu.institution}</Text>
                          <Text fontSize="sm">{edu.field_of_study}</Text>
                        </Box>
                        <Box textAlign={{ base: "left", sm: "right" }} mt={{ base: 1, sm: 0 }}>
                          <Text fontSize="sm" color="gray.600">
                            {formatDate(edu.start_date)} - {edu.end_date ? formatDate(edu.end_date) : 'Present'}
                          </Text>
                          {edu.grade && (
                            <Text fontSize="sm">
                              GPA: {edu.grade}
                            </Text>
                          )}
                        </Box>
                      </Flex>
                      {edu.activities && (
                        <Text mt={2} fontSize="sm">
                          <Text as="span" fontWeight="medium">Activities: </Text>
                          {edu.activities}
                        </Text>
                      )}
                    </Box>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          )}
        </GridItem>

        <GridItem>
          {/* Profile summary */}
          <Card mb={6} boxShadow="sm" bg={sectionBg}>
            <CardHeader pb={0}>
              <Heading size="md">Profile Summary</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                {candidate.address && (
                  <Flex>
                    <Text fontWeight="bold" width="130px">Address:</Text>
                    <Text>{candidate.address}</Text>
                  </Flex>
                )}
                
                {candidate.department && (
                  <Flex>
                    <Text fontWeight="bold" width="130px">Department:</Text>
                    <Text>{candidate.department}</Text>
                  </Flex>
                )}
                
                {candidate.preferred_salary_range && (
                  <Flex>
                    <Text fontWeight="bold" width="130px">Salary Range:</Text>
                    <Text>
                      {candidate.preferred_salary_range.min.toLocaleString()} - {candidate.preferred_salary_range.max.toLocaleString()} {candidate.preferred_salary_range.currency}
                    </Text>
                  </Flex>
                )}
                
                {candidate.hire_date && (
                  <Flex>
                    <Text fontWeight="bold" width="130px">Hire Date:</Text>
                    <Text>{formatDate(candidate.hire_date)}</Text>
                  </Flex>
                )}
                
                <Flex>
                  <Text fontWeight="bold" width="130px">Role:</Text>
                  <Badge colorScheme="blue">{candidate.role}</Badge>
                </Flex>
                
                <Flex>
                  <Text fontWeight="bold" width="130px">Status:</Text>
                  <Badge colorScheme={candidate.status === 'active' ? 'green' : 'gray'}>
                    {candidate.status}
                  </Badge>
                </Flex>
              </VStack>
            </CardBody>
          </Card>
          
          {/* Skills section */}
          {candidate.skills && candidate.skills.length > 0 && (
            <Card mb={6} boxShadow="sm" bg={sectionBg}>
              <CardHeader pb={0}>
                <Heading size="md">Skills</Heading>
              </CardHeader>
              <CardBody>
                <Flex wrap="wrap" gap={2}>
                  {candidate.skills.map((skill, index) => (
                    <Tag key={index} size="md" borderRadius="full" variant="solid" colorScheme="blue">
                      {skill}
                    </Tag>
                  ))}
                </Flex>
              </CardBody>
            </Card>
          )}

          {/* Links & Documents */}
          <Card boxShadow="sm" bg={sectionBg}>
            <CardHeader pb={0}>
              <Heading size="md">Links & Documents</Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={3} align="stretch">
                {candidate.resume_url && (
                  <Link href={candidate.resume_url} isExternal color="blue.500">
                    <Flex align="center">
                      <Text>Resume</Text>
                      <ExternalLinkIcon mx="2px" />
                    </Flex>
                  </Link>
                )}
                
                {candidate.linkedin_url && (
                  <Link href={candidate.linkedin_url} isExternal color="blue.500">
                    <Flex align="center">
                      <Text>LinkedIn Profile</Text>
                      <ExternalLinkIcon mx="2px" />
                    </Flex>
                  </Link>
                )}
                
                {candidate.github_url && (
                  <Link href={candidate.github_url} isExternal color="blue.500">
                    <Flex align="center">
                      <Text>GitHub Profile</Text>
                      <ExternalLinkIcon mx="2px" />
                    </Flex>
                  </Link>
                )}
                
                {candidate.portfolio_url && (
                  <Link href={candidate.portfolio_url} isExternal color="blue.500">
                    <Flex align="center">
                      <Text>Portfolio</Text>
                      <ExternalLinkIcon mx="2px" />
                    </Flex>
                  </Link>
                )}

                {!candidate.resume_url && !candidate.linkedin_url && !candidate.github_url && !candidate.portfolio_url && (
                  <Text color="gray.500" fontSize="sm">No links available</Text>
                )}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
};

export default CandidateProfile; 
