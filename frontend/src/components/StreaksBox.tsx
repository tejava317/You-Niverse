import React, { useEffect, useState } from "react";
import { Box, Text, Image, Flex } from "@chakra-ui/react";

interface StreaksBoxProps {
  project_id: string | undefined; // project_id를 Prop으로 정의
}

const StreaksBox: React.FC<StreaksBoxProps> = ({ project_id }) => {
    const [streakData, setStreakData] = useState<{
        message: string;
        streak: number;
      } | null>(null);
    
      const [error, setError] = useState<string | null>(null);
    
      useEffect(() => {
        const fetchStreakData = async () => {
          try {
            // localStorage에서 user_id 가져오기
            const user_id = localStorage.getItem("user_id");
            if (!user_id || !project_id) {
              setError("User ID or Project ID is missing.");
              return;
            }
    
            // API 호출
            const response = await fetch(`${import.meta.env.BACKEND_URL}/api/github/load-streak/${user_id}/${project_id}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch streak data: ${response.statusText}`);
            }
    
            const data = await response.json();
            setStreakData({
              message: data.message,
              streak: data.streak,
            });
          } catch (error) {
            console.error("Error fetching streak data:", error);
            setError(error instanceof Error ? error.message : "Unknown error occurred");
          }
        };
    
        fetchStreakData();
      }, [project_id]);
    




    return (
    <Box flex="1" display="flex" flexDirection="column" gap={4}>
      {/* Streaks Section */}
      <Box>
        <Text fontSize="sm" color="gray.400" mb={2}>
          Streaks
        </Text>
        <Box
          h="200px"
          border="1px solid white"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          position="relative"
          px="15px"
        >
          {/* Spaceship Image */}
          <Image
            src="/images/우주선_step0.png"
            alt="Streaks Image"
            maxW="100%"
            maxH="100%"
            objectFit="contain"
          />
          <Text fontSize="2xl" fontWeight="bold" color="white" ml="15px">
            {streakData?.streak || 0} Day Streak
          </Text>
        </Box>
      </Box>

      {/* Project ID Section */}
      <Box mt={4}>
        <Text fontSize="sm" color="gray.400" mb={2}>
          Project ID
        </Text>
        <Box
          h="50px"
          border="1px solid white"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Text fontSize="lg" color="white" fontWeight="bold">
            {project_id || "No Project Selected"}
          </Text>
        </Box>
      </Box>

      {/* D-Day and Today's Commit Section */}
      <Flex gap={4} justifyContent="space-between">
        <Box flex="1">
          <Text fontSize="sm" color="gray.400" mb={2}>
            Today's Commit
          </Text>
          <Box
            h="105px"
            border="1px solid white"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="2xl" color="white" fontWeight="bold">
              3
            </Text>
          </Box>
        </Box>
        <Box flex="1">
          <Text fontSize="sm" color="gray.400" mb={2}>
            D-Day
          </Text>
          <Box
            h="105px"
            border="1px solid white"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize="2xl" color="white" fontWeight="bold">
              D-7
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default StreaksBox;
