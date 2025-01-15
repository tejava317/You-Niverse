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
  const project_id = location.state?.project_id || localStorage.getItem('current_project_id');

  useEffect(() => {
    if (!project_id) {
      console.error("No project ID found");
      navigate("/MainPage"); // Redirect if no project ID
      return;
    }
  }, [project_id, navigate]);


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
        <FlightForm />
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
