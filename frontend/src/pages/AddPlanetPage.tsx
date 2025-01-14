import * as React from "react";
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

const AddPlanet: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const userId = "your_user_id_here"; // Replace with the actual user ID from context or props
  const [currentPlanet] = React.useState({
    name: "Mercury",
    video: "/images/mercury.mp4",
  });

  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [projectName, setProjectName] = React.useState("");
  const [githubPrefix, setGithubPrefix] = React.useState("callasio");
  const [githubRepo, setGithubRepo] = React.useState("");

  const handleSaveProject = () => {
    const savedProject = {
      projectName,
      StartDate: startDate?.toISOString() || null,
      EndDate: endDate?.toISOString() || null,
      GithubAddress: `https://github.com/${githubPrefix}/${githubRepo}`,
    };

    console.log("Saved Project:", savedProject);
    alert("Project saved!");
  };

  const handleBackToMain = () => {
    navigate("/MainPage");
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
        minW="1350px"
        minH="800px"
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
              onDoubleClick={() => navigate("/PlanetProjectPage")}
            />
          </Box>
        </Box>

        {/* Black Box under planet name */}
        <Box
          position="absolute"
          top="79.5%"
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
              onChange={(date) => setStartDate(date)}
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
              onChange={(date) => setEndDate(date)}
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
                fontSize="sm"
                h="40px"
                display="flex"
                alignItems="center"
              >
                github.com/
              </Text>

              <Box
                position="relative"
                borderBottom="1px solid white"
                h="40px"
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
                  border="none"
                  _focus={{ outline: "none" }}
                  h="100%"
                  px={0}
                  w="100%"
                />
              </Box>

              <Text
                color="gray.400"
                fontSize="sm"
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
                h="40px"
                display="flex"
                alignItems="center"
                flex="1"
              >
                <Input
                  id="github-repo"
                  placeholder="repo name"
                  bg="transparent"
                  color="white"
                  border="none"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  _placeholder={{ color: "gray.500" }}
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
            Add Project
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