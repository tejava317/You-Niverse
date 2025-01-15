import React, { useEffect, useState } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

interface ProjectInfo {
  github_repo: string;
  owner_name: string;
}

interface FlightFormProps {
  user_id: string;
  project_id: string;
  planetName: string;
  projectName: string;
}

const FlightForm: React.FC<FlightFormProps> = ({ user_id, project_id, planetName, projectName }) => {
  const [projectInfo, setProjectInfo] = useState<ProjectInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Debug: FlightForm Props:", {
      user_id,
      project_id,
      planetName,
      projectName,
    });
  }, [user_id, project_id, planetName, projectName]);

  
  // Props 변화 추적
  useEffect(() => {
    console.log("=== Debug: FlightForm Props ===");
    console.log("Props received:", {
      user_id,
      project_id,
      planetName,
      projectName,
    });
  }, [user_id, project_id, planetName, projectName]);

  // 컴포넌트 마운트 시 확인
  useEffect(() => {
    console.log("FlightForm mounted");
    return () => console.log("FlightForm unmounted");
  }, []);

  useEffect(() => {
    const fetchProjectInfo = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const endpoint = `/api/project/load-project-info`;
        const fullUrl = `${baseUrl}${endpoint}/${user_id}/${project_id}`;

        console.log("Debug: API Call Info", { baseUrl, fullUrl });

        if (!user_id || !project_id) {
          console.error("Validation Failed: Missing user_id or project_id");
          setError("Missing required user or project ID");
          setIsLoading(false);
          return;
        }

        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`API call failed with status: ${response.status}`);
        }

        const data = await response.json();
        setProjectInfo({ github_repo: data.github_repo, owner_name: data.owner_name });
      } catch (err) {
        console.error("API Error:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    if (user_id === "") return;
    fetchProjectInfo();
  }, [user_id, project_id]);

  if (isLoading) {
    console.log("FlightForm: Loading state");
    return (
      <Flex justifyContent="center" alignItems="center" w="100%" h="40px">
        <Text color="white">Loading project information...</Text>
      </Flex>
    );
  }

  if (error || !projectInfo) {
    console.log("FlightForm: Error state", { error });
    return (
      <Flex justifyContent="center" alignItems="center" w="100%" h="40px">
        <Text color="red.500">{error || "Failed to load project information"}</Text>
      </Flex>
    );
  }

  console.log("FlightForm: Normal state", { projectInfo });

  return (
    <Flex justifyContent="center" alignItems="center" gap={4} w="100%" mb={4}>
      {/* Planet Name Section */}
      <Box flex="1">
        <Text fontSize="sm" color="gray.400" mb={2}>
          Planet Name
        </Text>
        <Flex
          bg="black"
          color="white"
          border="1px solid white"
          h="40px"
          alignItems="center"
          justifyContent="center"
          fontSize="sm"
          borderRadius="0"
          position="relative"
        >
          <Box
            position="absolute"
            left={130}
            w="30px"
            h="30px"
            display="flex"
            alignItems="center"
          >
            <img
              src={`/images/${planetName.toLowerCase()}.png`}
              alt={planetName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </Box>
          <Text>{planetName}</Text>
        </Flex>
      </Box>

      {/* Project Name Section */}
      <Box flex="1">
        <Text fontSize="sm" color="gray.400" mb={2}>
          Project Name
        </Text>
        <Text
          bg="black"
          color="white"
          border="1px solid white"
          h="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="sm"
          borderRadius="0"
        >
          {projectName}
        </Text>
      </Box>

      {/* GitHub Section */}
      <Box flex="1">
        <Text fontSize="sm" color="gray.400" mb={2}>
          GitHub
        </Text>
        <a
          href={`https://github.com/${projectInfo.owner_name}/${projectInfo.github_repo}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ width: '100%', textDecoration: 'none' }}
        >
          <Text
            bg="black"
            color="white"
            border="1px solid white"
            h="40px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="sm"
            borderRadius="0"
            px={4}
            overflow="hidden"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            _hover={{
              color: 'blue.300',
              borderColor: 'blue.300',
            }}
            transition="all 0.2s"
          >
            <Box
              w="20px"
              h="20px"
              mr={2} /* Adds spacing between the image and text */
              display="flex"
              alignItems="center"
            >
              <img
                src={`/images/github.png`}
                alt="GitHub logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            /{projectInfo.owner_name}/{projectInfo.github_repo}
          </Text>
        </a>
      </Box>
    </Flex>
  );
};

export default FlightForm;
