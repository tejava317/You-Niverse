import React, { useEffect, useState } from "react";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Header from "../components/ProjectHeader";
import FlightForm from "../components/FlightForm";
import ProgressBar from "../components/ProgressBar";
import StreaksBox from "../components/StreaksBox";
import ScrumSection from "../components/ScrumSection";

const PlanetProject: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { project_id, planetName: statePlanetName, projectName: stateProjectName } = location.state || {};
  const [planetName, setPlanetName] = useState<string>("Unknown Destination");
  const [projectName, setProjectName] = useState<string>("Unknown Project");
  const [user_id, setUserId] = useState<string>("");

  useEffect(() => {
    // localStorage에 있는 모든 키-값 쌍을 출력
    console.log("=== Debug: All localStorage items ===");
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        console.log(`${key}: ${localStorage.getItem(key)}`);
      }
    }

    if (!project_id) {
      console.error("No project ID found");
      navigate("/MainPage");
      return;
    }

    // user_id 확인 및 설정
    const storedUserId = localStorage.getItem("user_id");
    console.log("Debug: Stored User ID:", storedUserId);

    if (!storedUserId) {
      console.error("No user ID found in localStorage");
      navigate("/");
      return;
    }

    setUserId(storedUserId);

    // location.state에서 planetName이 없으면 localStorage에서 가져옵니다
    const storedPlanetName = localStorage.getItem("currentPlanetName");
    const storedProjectName = localStorage.getItem("currentProjectName");

    setPlanetName(statePlanetName || storedPlanetName || "Unknown Destination");
    setProjectName(stateProjectName || storedProjectName || "Unknown Project");

    // 전체 상태 로깅
    console.log("Debug: Current State:", {
      user_id: storedUserId,
      project_id,
      statePlanetName,
      storedPlanetName,
      stateProjectName,
      storedProjectName,
    });
  }, [project_id, statePlanetName, stateProjectName, navigate]);

  // user_id 상태 변화 감지
  useEffect(() => {
    console.log("Debug: Current user_id state:", user_id);
  }, [user_id]);

  useEffect(() => {
    const storedUserId = localStorage.getItem("user_id");
    console.log("Debug: Stored User ID from localStorage:", storedUserId);
  
    if (!storedUserId) {
      console.error("No user ID found in localStorage");
      navigate("/"); // Redirect if no user ID
      return;
    }
  
    setUserId(storedUserId);
  }, []);
  

  return (
    <Box
      bgColor="black"
      h="100vh"
      w="100vw"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      position="relative"
      overflow="hidden"
    >
      <IconButton
        position="absolute"
        top="20px"
        left="20px"
        bg="black"
        color="white"
        aria-label="Back to Main"
        icon={<ArrowBackIcon />}
        _hover={{ bg: "gray.600", border: "1px solid red" }}
        onClick={() => navigate("/MainPage")}
      />
      <Box w="90%" maxW="1400px" h="85vh" display="flex" flexDirection="column" gap={6}>
        <Header />
        <FlightForm
          user_id={user_id}
          project_id={project_id}
          planetName={planetName}
          projectName={projectName}
        />
        <ProgressBar project_id={project_id} />
        <Flex w="100%" gap={4}>
          <StreaksBox project_id={project_id} />
          <ScrumSection project_id={project_id} />
        </Flex>
      </Box>
    </Box>
  );
};

export default PlanetProject;
