import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Image,
  Input,
  FormLabel,
  Flex,
  Button,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowBackIcon, CalendarIcon } from "@chakra-ui/icons";
import {saveProject} from "../utils/db"


const planetData = [
  { name: "Mercury", video: "/images/mercury.mp4" },
  { name: "Venus", video: "/images/venus.mp4" },
  { name: "Moon", video: "/images/moon.mp4" },
  { name: "Mars", video: "/images/mars.mp4" },
  { name: "Jupiter", video: "/images/jupiter.mp4" },
  { name: "Saturn", video: "/images/saturn.mp4" },
  { name: "Uranus", video: "/images/uranus.mp4" },
  { name: "Neptune", video: "/images/neptune.mp4" },
];

const AddPlanet: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const user_id = localStorage.getItem("user_id"); // Get user_id from localStorage
  const [currentPlanet, setCurrentPlanet] = useState(planetData[0]);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [projectName, setProjectName] = useState("");
  const [githubPrefix, setGithubPrefix] = useState(localStorage.getItem("github_username") || "callasio");
  const [githubRepo, setGithubRepo] = useState("");


  useEffect(() => {
    const totalPlanets = Number(localStorage.getItem("totalPlanets")) || 0; // 기본값을 0으로 설정
    const planetIndex = totalPlanets; // totalPlanets를 그대로 사용
    setCurrentPlanet(planetData[planetIndex % planetData.length]); // 올바른 행성을 설정
  }, []);

  // Function to handle saving the project
  const handleSaveProject = async () => {
    if (!user_id) {
      toast({
        title: "User ID Missing",
        description: "Unable to save project without a valid user ID.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (!projectName || !startDate || !endDate || !githubRepo) {
      toast({
        title: "Missing Fields",
        description: "Please fill out all fields before saving.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }


    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0]; // Extract yyyy-mm-dd
    };



    //backend project data schema
    const projectData = {
      project_name: projectName,
      project_start: formatDate(startDate),
      project_end: formatDate(endDate),
      owner_username: githubPrefix,
      github_repo: githubRepo,
    };

     // Log projectData to see the structure and values
     console.log("Project Data:", projectData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/create-project/${user_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(projectData),
        }
      );

      if (response.ok) {

        const data = await response.json(); // The response from the backend
        const { project_id } = data;


        // IndexedDB project schema
        const indexedDBProject = {
          user_id,
          projectName,
          project_id: project_id,
          createdAt: new Date().toISOString(),
          project_start:formatDate(startDate),
          project_end:formatDate(endDate),
        };

         // Save to IndexedDB
         await saveProject(indexedDBProject);


      
       // Update the planet index
       const currentPlanetIndex = Number(localStorage.getItem("currentPlanetIndex")) || 0;
       const nextPlanetIndex = (currentPlanetIndex + 1) % planetData.length;
       localStorage.setItem("currentPlanetIndex", String(nextPlanetIndex));

        toast({
          title: "Project Saved!",
          description: "Your project has been added successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        navigate("/MainPage");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error Saving Project",
          description: errorData.message || "Something went wrong.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error saving project:", error);
      toast({
        title: "Network Error",
        description: "Unable to connect to the server.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleBackToMain = () => {
    navigate("/MainPage");
  };
  const handleDateChange = (date: Date | null, setDate: (date: Date | null) => void) => {
    if (date) {
      // 시간 보정: 로컬 시간대를 제거하여 UTC 자정으로 설정
      const correctedDate = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      setDate(correctedDate);
    }
  };
  
  
  // Custom Input for react-datepicker
  const CustomDateInput = React.forwardRef<HTMLInputElement, any>(
    ({ value, onClick }, ref) => (
      <Flex
        alignItems="center"
        bg="black"
        border="1px solid white"
        borderRadius="0"
        px={3}
        w="352px"
        h="40px"
        onClick={onClick}
        ref={ref}
        cursor="pointer"
      >
        <Input
          value={value}
          readOnly
          placeholder="Select date"
          border="none"
          color="white"
          bg="transparent"
          _placeholder={{ color: "gray.500" }}
          _focus={{ outline: "none" }}
          h="40px"
        />
        <CalendarIcon color="white" ml={2} />
      </Flex>
    )
    
    
  );

  
  return (
    <Box
      bgColor="black"
      h="100vh"
      w="100vw"
      overflow="hidden"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Central Content Box with black background */}
      <Box
        position="relative"
        w="90vw"
        h="90vh"
        minW="1200px"
        minH="600px"
        bgColor="black"
        zIndex={2}
      >
        {/* Circular Line with Video */}
        <Box
          position="absolute"
          top="55%"
          left="25%"
          transform="translate(-50%, -50%)"
          w="350px"
          h="350px"
          border="0.05px solid rgba(255, 255, 255, 0.2)"
          borderRadius="50%"
          overflow="hidden"
          zIndex={4}
        >
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            w="250px"
            h="250px"
          >
            <video
              src={currentPlanet.video}
              autoPlay
              loop
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              
            />
          </Box>
        </Box>
        <Text
          position="absolute"
          top="80%"
          left="25%"
          transform="translate(-50%, -50%)"
          color="white"
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          zIndex={5}
        >
          {currentPlanet.name}
        </Text>

        {projectName && (
          <Text
            position="absolute"
            top="84%"
            left="25%"
            transform="translate(-50%, -50%)"
            color="gray.400"
            fontSize="lg"
            textAlign="center"
            zIndex={6}
          >
            {projectName}
          </Text>
        )}


        {/* Black Box under planet name */}
        <Box
          position="absolute"
          top="82%"
          left="25%"
          transform="translate(-50%, -50%)"
          w="150px"
          h="100px"
          bg="black"
          zIndex={4}
          borderTop="0.05px solid rgba(255, 255, 255, 0.2)"
        />

        {/* Back Button */}
        <IconButton
          icon={<ArrowBackIcon />}
          aria-label="Back to Main Page"
          position="absolute"
          top="10px"
          left="10px"
          size="lg"
          bg="transparent"
          color="white"
          zIndex={5}
          _hover={{
            color: "gray.400",
          }}
          onClick={handleBackToMain}
        />

        {/* Right-Side Form */}
        <Box
          position="absolute"
          top="20%"
          right="20%"
          w="400px"
          bg="black"
          p={6}
          color="white"
          zIndex={4}
        >
          <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
            Project Details
          </Text>

          {/* Project Name Input */}
          <Box mb={4}>
            <FormLabel htmlFor="project-name" color="gray.400">
              Project Name
            </FormLabel>
            <Input
              id="project-name"
              placeholder="Enter your project name"
              bg="black"
              color="white"
              borderRadius="0"
              border="1px solid white"
              _placeholder={{ color: "gray.500" }}
              h="40px"
              w="100%"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </Box>

          {/* Start Date Input */}
          <Box mb={4}>
            <FormLabel htmlFor="start-date" color="gray.400">
              Start Date
            </FormLabel>
            <DatePicker
               selected={startDate}
            onChange={(date) => handleDateChange(date, setStartDate)}
            dateFormat="MMMM d, yyyy"
            customInput={<CustomDateInput />}
            />
          </Box>

          {/* End Date Input */}
          <Box mb={4}>
            <FormLabel htmlFor="end-date" color="gray.400">
              End Date
            </FormLabel>
            <DatePicker
             selected={endDate}
             onChange={(date) => handleDateChange(date, setEndDate)}
             dateFormat="MMMM d, yyyy"
             customInput={<CustomDateInput />}
            />
          </Box>

          {/* GitHub Repository Input */}
          <Box mb={4}>
            <FormLabel htmlFor="github-repo" color="gray.400">
              GitHub Repository
            </FormLabel>
            <Flex alignItems="center">
              <Text
                color="gray.400"
                fontSize="xs"
                h="40px"
                display="flex"
                alignItems="center"
              >
                github.com/
              </Text>

              <Box
                position="relative"
                borderBottom="1px solid white"
                h="23px"
                display="flex"
                alignItems="center"
                w="80px"
              >
                <Input
                  value={githubPrefix}
                  onChange={(e) => setGithubPrefix(e.target.value)}
                  id="github-prefix"
                  bg="transparent"
                  color="gray.500"
                  fontSize="xs"
                  border="none"
                  _focus={{ outline: "none" }}
                  h="100%"
                  px={0}
                  w="100%"
                />
              </Box>

              <Text
                color="gray.400"
                fontSize="xs"
                px={2}
                h="40px"
                display="flex"
                alignItems="center"
              >
                /
              </Text>

              <Box
                position="relative"
                borderBottom="1px solid white"
                h="23px"
                display="flex"
                alignItems="center"
                flex="1"
              >
                <Input
                  id="github-repo"
                  placeholder="repository name"
                  bg="transparent"
                  color="white"
                  fontSize="xs"

                  border="none"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  _placeholder={{ color: "gray.50 0" }}
                  _focus={{ outline: "none" }}
                  h="100%"
                  px={0}
                  w="100%"
                />
              </Box>
            </Flex>
          </Box>

          {/* Save Project Button */}
          <Button
            w="100%"
            bg="#FF0000"
            color="white"
            borderRadius="0"
            _hover={{ bg: "gray.600" }}
            h="40px"
            onClick={handleSaveProject}
          >
            Add a Planet
          </Button>
        </Box>
      </Box>

      {/* Moon background image */}
      <Image
        src="/images/moon.png"
        alt="Moon Image"
        position="absolute"
        right="-10%"
        top="50%"
        transform="translateY(-50%)"
        objectFit="contain"
        zIndex={1}
      />
    </Box>
  );
};

export default AddPlanet;
