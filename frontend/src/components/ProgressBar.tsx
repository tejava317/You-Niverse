import React, { useEffect, useState } from "react";
import { Box, Text, Progress } from "@chakra-ui/react";

interface ProgressBarProps {
  project_id: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ project_id }) => {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        if (!user_id || !project_id) {
          throw new Error("User ID or Project ID is missing.");
        }

        // Fetch progress directly from the API
        const projectInfoUrl = `${import.meta.env.VITE_BACKEND_URL}/api/project/load-project-info/${user_id}/${project_id}`;
        const projectInfoResponse = await fetch(projectInfoUrl);

        if (!projectInfoResponse.ok) {
          throw new Error(`Failed to fetch project info: ${projectInfoResponse.statusText}`);
        }

        const projectInfoData = await projectInfoResponse.json();
        if (projectInfoData.progress !== undefined) {
          setProgress(projectInfoData.progress);
        } else {
          throw new Error("Progress data is missing in the API response.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      }
    };

    fetchProgress();
  }, [project_id]);

  return (
    <Box w="100%" mb={6}>
      {progress !== null ? (
        <>
          <Text color="white" mb={2}>
            {progress}% Complete
          </Text>
          <Progress value={progress} size="xs" colorScheme="red" />
        </>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <Text color="white">Loading progress...</Text>
      )}
    </Box>
  );
};

export default ProgressBar;
