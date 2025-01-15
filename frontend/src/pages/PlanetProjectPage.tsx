//PlanetProjectPage.tsx
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
  const { project_id, planetName: statePlanetName, projectName: stateProjectName  } = location.state || {};
  const [planetName, setPlanetName] = useState<string>("Unknown Destination");
  const [projectName, setProjectName] = useState<string>("Unknown Project");

  useEffect(() => {
    if (!project_id) {
      console.error("No project ID found");
      navigate("/MainPage");
      return;
    }

    // location.state에서 planetName이 없으면 localStorage에서 가져옵니다
    const storedPlanetName = localStorage.getItem("currentPlanetName");
    const storedProjectName = localStorage.getItem("currentProjectName");
    
    setPlanetName(statePlanetName || storedPlanetName || "Unknown Destination");
    setProjectName(stateProjectName || storedProjectName || "Unknown Project");
    

    // 디버깅을 위한 로그
    console.log({
      statePlanetName,
      storedPlanetName,
      stateProjectName,
      storedProjectName
    });

  }, [project_id, statePlanetName,stateProjectName, navigate]);



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
        <FlightForm planetName={planetName} projectName={projectName} />
        <ProgressBar project_id={project_id} />
        <Flex w="100%" gap={4}>
          <StreaksBox 
          project_id={project_id}
          />
          <ScrumSection
            project_id={project_id} // ScrumSection에 projectId 전달
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default PlanetProject;
