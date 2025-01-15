import React, { useEffect, useState } from "react";
import { Box, Text, Image, Flex } from "@chakra-ui/react";
import { getProjectById } from "../utils/db"; // IndexedDB 함수 import

interface StreaksBoxProps {
  project_id: string | undefined; // project_id를 Prop으로 정의
}




const getStreakImage = (streak: number): string => {
  if (streak >= 8) return "/images/우주선_step4.png";
  if (streak >= 6) return "/images/우주선_step3.png";
  if (streak >= 4) return "/images/우주선_step2.png";
  if (streak >= 1) return "/images/우주선_step1.png";
  return "/images/우주선_step0.png";
};

const StreaksBox: React.FC<StreaksBoxProps> = ({ project_id }) => {
  const [streakData, setStreakData] = useState<{
    message: string;
    streak: number;
  } | null>(null);

  const [commitsToday, setCommitsToday] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dDay, setDday] = useState<number | null>(null); // D-Day 상태 추가

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        //console.log("User ID:", user_id);
        //console.log("Project ID:", project_id);

        if (!user_id || !project_id) {
          throw new Error("User ID or Project ID is missing.");
        }

        // Fetch streak data
        const streakUrl = `${import.meta.env.VITE_BACKEND_URL}/api/github/load-streak/${user_id}/${project_id}`;
        //console.log("Streak API URL:", streakUrl);
        const streakResponse = await fetch(streakUrl);
        //console.log("Streak API Response Status:", streakResponse.status);

        if (!streakResponse.ok) {
          throw new Error(`Failed to fetch streak data: ${streakResponse.statusText}`);
        }

        const streakData = await streakResponse.json();
        //console.log("Fetched Streak Data:", streakData);
        setStreakData({
          message: streakData.message,
          streak: streakData.streak,
        });

        // Fetch commits today data
        const commitsUrl = `${import.meta.env.VITE_BACKEND_URL}/api/github/load-commits-today/${user_id}/${project_id}`;
        //console.log("Commits Today API URL:", commitsUrl);
        const commitsResponse = await fetch(commitsUrl);
        //console.log("Commits Today API Response Status:", commitsResponse.status);

        if (!commitsResponse.ok) {
          throw new Error(`Failed to fetch commits today: ${commitsResponse.statusText}`);
        }

        const commitsData = await commitsResponse.json();
        //console.log("Fetched Commits Today Data:", commitsData);
        setCommitsToday(commitsData.commits_today);

        // Fetch D-Day data from /api/project/load-project-info
        const projectInfoUrl = `${import.meta.env.VITE_BACKEND_URL}/api/project/load-project-info/${user_id}/${project_id}`;
        //console.log("Project Info API URL:", projectInfoUrl);
        const projectInfoResponse = await fetch(projectInfoUrl);
        //console.log("Project Info API Response Status:", projectInfoResponse.status);

        if (!projectInfoResponse.ok) {
          throw new Error(`Failed to fetch project info: ${projectInfoResponse.statusText}`);
        }

        const projectInfoData = await projectInfoResponse.json();
        //console.log("Fetched Project Info Data:", projectInfoData);
        setDday(projectInfoData.d_day || "N/A");
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Unknown error occurred");
      }
    };

    fetchData();
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
            src={streakData ? getStreakImage(streakData.streak) : "/images/우주선_step0.png"}
            alt="Streaks Image"
            maxW="80%"
            maxH="80%"
            objectFit="contain"
          />
          <Text fontSize="2xl" fontWeight="bold" color="white" ml="40px">
            {streakData ? `${streakData.streak} Day Streak` : "Fetching streak..."} !!
          </Text>
        </Box>
      </Box>

      {/* Error Message */}
      {error && (
        <Text fontSize="sm" color="red.500" mt={2}>
          {error}
        </Text>
      )}

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
            <Text
              fontSize="2xl"
              color={commitsToday === 0 ? "red.500" : "white"}
              fontWeight="bold"
            >
              {commitsToday !== null ? commitsToday : "Loading commits..."}
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
              {dDay !== null ? `${dDay}` : "Calculating..."}
            </Text>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default StreaksBox;
