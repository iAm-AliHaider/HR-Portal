import { useState, useEffect } from "react";

import { useRouter } from "next/router";

import { AddIcon } from "@chakra-ui/icons";
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
  Checkbox,
  Text,
} from "@chakra-ui/react";

import { Job, JobStatus } from "../../../packages/types/hr";
import { createJob, updateJob, getJobById } from "../../services/jobs";

interface JobFormProps {
  jobId?: string;
  onSave?: (job: Job) => void;
}

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
  "Temporary",
];
const JOB_DEPARTMENTS = [
  "Engineering",
  "Product",
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "Finance",
  "HR",
  "Operations",
  "Legal",
  "Other",
];
const JOB_LOCATIONS = ["Remote", "Hybrid", "On-site"];

const JobForm = ({ jobId, onSave }: JobFormProps) => {
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!jobId);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSkill, setNewSkill] = useState("");
  const [newResponsibility, setNewResponsibility] = useState("");
  const [newRequirement, setNewRequirement] = useState("");

  const [job, setJob] = useState<Partial<Job>>({
    title: "",
    status: "draft",
    description: "",
    job_type: "full_time",
    dept_id: "dept1",
    location: "Remote",
    salary_range: {
      min: 0,
      max: 0,
      currency: "USD",
    },
    skills_required: [],
    responsibilities: [],
    benefits: [],
    is_remote: true,
    is_featured: false,
    poster_id: "user1",
  });

  useEffect(() => {
    const fetchJob = async () => {
      if (jobId) {
        try {
          setIsLoading(true);
          const jobData = await getJobById(jobId);
          if (jobData) {
            setJob(jobData);
          } else {
            toast({
              title: "Error",
              description: "Job not found",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
            router.push("/jobs");
          }
        } catch (error) {
          console.error("Error fetching job:", error);
          toast({
            title: "Error",
            description: "Failed to load job data",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchJob();
  }, [jobId, router, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setJob((prev) => ({ ...prev, [name]: checked }));
  };

  const handleNumberChange = (name: string, value: number) => {
    setJob((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const addItem = (
    field: "skills" | "responsibilities" | "requirements",
    value: string,
  ) => {
    if (!value.trim()) return;

    const fieldMap = {
      skills: "skills_required",
      responsibilities: "responsibilities",
      requirements: "requirements",
    };

    const actualField = fieldMap[field] as keyof Job;

    setJob((prev) => {
      const currentItems = (prev[actualField] as string[]) || [];
      return {
        ...prev,
        [actualField]: [...currentItems, value.trim()],
      };
    });

    // Reset the input field
    if (field === "skills") setNewSkill("");
    if (field === "responsibilities") setNewResponsibility("");
    if (field === "requirements") setNewRequirement("");
  };

  const removeItem = (
    field: "skills" | "responsibilities" | "requirements",
    index: number,
  ) => {
    const fieldMap = {
      skills: "skills_required",
      responsibilities: "responsibilities",
      requirements: "requirements",
    };

    const actualField = fieldMap[field] as keyof Job;

    setJob((prev) => {
      const currentItems = (prev[actualField] as string[]) || [];
      return {
        ...prev,
        [actualField]: currentItems.filter((_, i) => i !== index),
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!job.title) newErrors.title = "Title is required";
    if (!job.description) newErrors.description = "Description is required";
    if (
      job.salary_range?.min !== undefined &&
      job.salary_range?.max !== undefined &&
      job.salary_range.min > job.salary_range.max
    ) {
      newErrors.min_salary =
        "Minimum salary cannot be greater than maximum salary";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);

      let savedJob;
      if (isEditing) {
        savedJob = await updateJob(jobId!, job as Job);
        toast({
          title: "Job Updated",
          description: "The job has been updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Add org_id for new jobs
        const jobWithOrgId = {
          ...job,
          org_id: "org1", // In a real app, this would come from context/session
        };

        savedJob = await createJob(jobWithOrgId as Job);
        toast({
          title: "Job Created",
          description: "The job has been created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }

      if (onSave) {
        onSave(savedJob);
      } else {
        // Navigate to job detail page
        router.push(`/jobs/${savedJob.id}`);
      }
    } catch (error) {
      console.error("Error saving job:", error);
      toast({
        title: "Error",
        description: isEditing
          ? "Failed to update job"
          : "Failed to create job",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);

      const jobToPublish = {
        ...job,
        status: "published" as JobStatus,
        published_at: new Date().toISOString(),
      };

      let savedJob;
      if (isEditing) {
        savedJob = await updateJob(jobId!, jobToPublish as Job);
      } else {
        // Add org_id for new jobs
        const jobWithOrgId = {
          ...jobToPublish,
          org_id: "org1", // In a real app, this would come from context/session
        };

        savedJob = await createJob(jobWithOrgId as Job);
      }

      toast({
        title: "Job Published",
        description: "The job has been published successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Navigate to job detail page
      router.push(`/jobs/${savedJob.id}`);
    } catch (error) {
      console.error("Error publishing job:", error);
      toast({
        title: "Error",
        description: "Failed to publish job",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={8}>
        {/* Basic Info Section */}
        <Box>
          <Heading size="md" mb={4}>
            Basic Information
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormControl isRequired isInvalid={!!errors.title}>
                <FormLabel>Job Title</FormLabel>
                <Input
                  name="title"
                  value={job.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Senior Software Engineer"
                />
                <FormErrorMessage>{errors.title}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Department</FormLabel>
                <Select
                  name="dept_id"
                  value={job.dept_id}
                  onChange={handleInputChange}
                >
                  {JOB_DEPARTMENTS.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Job Type</FormLabel>
                <Select
                  name="job_type"
                  value={job.job_type}
                  onChange={handleInputChange}
                >
                  {JOB_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormControl isRequired isInvalid={!!errors.description}>
                <FormLabel>Job Description</FormLabel>
                <Textarea
                  name="description"
                  value={job.description}
                  onChange={handleInputChange}
                  placeholder="Provide a detailed description of the job..."
                  minHeight="150px"
                />
                <FormErrorMessage>{errors.description}</FormErrorMessage>
              </FormControl>
            </GridItem>
          </Grid>
        </Box>

        <Divider />

        {/* Location Section */}
        <Box>
          <Heading size="md" mb={4}>
            Location
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Work Location Type</FormLabel>
                <Select
                  name="location"
                  value={job.location}
                  onChange={handleInputChange}
                >
                  {JOB_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Remote Work</FormLabel>
                <Switch
                  name="is_remote"
                  isChecked={job.is_remote}
                  onChange={handleSwitchChange}
                  size="lg"
                />
                <FormHelperText>
                  Allow remote work for this position
                </FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input
                  name="city"
                  value=""
                  onChange={handleInputChange}
                  placeholder="e.g. San Francisco"
                  isDisabled={job.location === "Remote"}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Country</FormLabel>
                <Input
                  name="country"
                  value=""
                  onChange={handleInputChange}
                  placeholder="e.g. United States"
                  isDisabled={job.location === "Remote"}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </Box>

        <Divider />

        {/* Compensation Section */}
        <Box>
          <Heading size="md" mb={4}>
            Compensation
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl isInvalid={!!errors.min_salary}>
                <FormLabel>Minimum Salary</FormLabel>
                <NumberInput
                  min={0}
                  value={job.salary_range?.min || 0}
                  onChange={(_, value) => {
                    setJob((prev) => ({
                      ...prev,
                      salary_range: {
                        ...prev.salary_range,
                        min: value || 0,
                        max: prev.salary_range?.max || 0,
                        currency: prev.salary_range?.currency || "USD",
                      },
                    }));
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage>{errors.min_salary}</FormErrorMessage>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Maximum Salary</FormLabel>
                <NumberInput
                  min={0}
                  value={job.salary_range?.max || 0}
                  onChange={(_, value) => {
                    setJob((prev) => ({
                      ...prev,
                      salary_range: {
                        ...prev.salary_range,
                        min: prev.salary_range?.min || 0,
                        max: value || 0,
                        currency: prev.salary_range?.currency || "USD",
                      },
                    }));
                  }}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Currency</FormLabel>
                <Select
                  name="currency"
                  value={job.salary_range?.currency || "USD"}
                  onChange={(e) => {
                    setJob((prev) => ({
                      ...prev,
                      salary_range: {
                        ...prev.salary_range,
                        min: prev.salary_range?.min || 0,
                        max: prev.salary_range?.max || 0,
                        currency: e.target.value,
                      },
                    }));
                  }}
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
          </Grid>
        </Box>

        <Divider />

        {/* Skills & Requirements Section */}
        <Box>
          <Heading size="md" mb={4}>
            Skills & Requirements
          </Heading>

          {/* Skills */}
          <FormControl mb={6}>
            <FormLabel>Required Skills</FormLabel>
            <InputGroup>
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="e.g. React.js"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem("skills", newSkill);
                  }
                }}
              />
              <InputRightElement>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => addItem("skills", newSkill)}
                >
                  <AddIcon />
                </Button>
              </InputRightElement>
            </InputGroup>

            <Flex flexWrap="wrap" mt={3} gap={2}>
              {job.skills_required?.map((skill, index) => (
                <Tag
                  key={index}
                  size="md"
                  borderRadius="full"
                  variant="solid"
                  colorScheme="blue"
                >
                  <TagLabel>{skill}</TagLabel>
                  <TagCloseButton onClick={() => removeItem("skills", index)} />
                </Tag>
              ))}
            </Flex>
          </FormControl>

          {/* Responsibilities */}
          <FormControl mb={6}>
            <FormLabel>Responsibilities</FormLabel>
            <InputGroup>
              <Input
                value={newResponsibility}
                onChange={(e) => setNewResponsibility(e.target.value)}
                placeholder="Add a job responsibility"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem("responsibilities", newResponsibility);
                  }
                }}
              />
              <InputRightElement>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => addItem("responsibilities", newResponsibility)}
                >
                  <AddIcon />
                </Button>
              </InputRightElement>
            </InputGroup>

            <Stack mt={3} spacing={2}>
              {job.responsibilities?.map((item, index) => (
                <Flex key={index} align="center">
                  <Button
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeItem("responsibilities", index)}
                    mr={2}
                  >
                    -
                  </Button>
                  <Text>{item}</Text>
                </Flex>
              ))}
            </Stack>
          </FormControl>

          {/* Requirements */}
          <FormControl mb={6}>
            <FormLabel>Requirements</FormLabel>
            <InputGroup>
              <Input
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="Add a job requirement"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addItem("requirements", newRequirement);
                  }
                }}
              />
              <InputRightElement>
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="ghost"
                  onClick={() => addItem("requirements", newRequirement)}
                >
                  <AddIcon />
                </Button>
              </InputRightElement>
            </InputGroup>

            <Stack mt={3} spacing={2}>
              {job.requirements?.map((item, index) => (
                <Flex key={index} align="center">
                  <Button
                    size="xs"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => removeItem("requirements", index)}
                    mr={2}
                  >
                    -
                  </Button>
                  <Text>{item}</Text>
                </Flex>
              ))}
            </Stack>
          </FormControl>
        </Box>

        <Divider />

        {/* Additional Information */}
        <Box>
          <Heading size="md" mb={4}>
            Additional Information
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <FormControl>
                <FormLabel>Application URL</FormLabel>
                <Input
                  name="application_url"
                  value={job.application_url || ""}
                  onChange={handleInputChange}
                  placeholder="External application URL (optional)"
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Contact Email</FormLabel>
                <Input
                  name="contact_email"
                  value={job.contact_email || ""}
                  onChange={handleInputChange}
                  placeholder="Email for inquiries about this position"
                  type="email"
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Visa Sponsorship</FormLabel>
                <Switch
                  name="visa_sponsorship"
                  isChecked={job.visa_sponsorship}
                  onChange={handleSwitchChange}
                  size="lg"
                />
                <FormHelperText>
                  Offer visa sponsorship for this position
                </FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Featured Job</FormLabel>
                <Switch
                  name="is_featured"
                  isChecked={job.is_featured}
                  onChange={handleSwitchChange}
                  size="lg"
                />
                <FormHelperText>
                  Highlight this job in job listings
                </FormHelperText>
              </FormControl>
            </GridItem>

            <GridItem colSpan={{ base: 1, md: 2 }}>
              <FormControl>
                <FormLabel>Internal Notes</FormLabel>
                <Textarea
                  name="internal_notes"
                  value={job.internal_notes || ""}
                  onChange={handleInputChange}
                  placeholder="Notes for internal use (not visible to applicants)"
                />
              </FormControl>
            </GridItem>
          </Grid>
        </Box>

        {/* Action Buttons */}
        <Flex justify="space-between" pt={4}>
          <Button
            variant="outline"
            onClick={() => router.push("/jobs")}
            isDisabled={isLoading}
          >
            Cancel
          </Button>

          <Box>
            <Button
              type="submit"
              colorScheme="blue"
              variant="outline"
              mr={3}
              isLoading={isLoading}
            >
              Save as Draft
            </Button>

            <Button
              colorScheme="green"
              onClick={handlePublish}
              isLoading={isLoading}
            >
              {isEditing ? "Update & Publish" : "Publish Job"}
            </Button>
          </Box>
        </Flex>
      </Stack>
    </Box>
  );
};

export default JobForm;
