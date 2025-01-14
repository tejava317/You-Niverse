import React, { useState } from "react";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Header from "../components/ProjectHeader";
import FlightForm from "../components/FlightForm";
import ProgressBar from "../components/ProgressBar";
import StreaksBox from "../components/StreaksBox";
import ScrumSection from "../components/ScrumSection";

const calendarMockData = [
  {
  date: "January 13, 2025",
  details: {
    done: "I did my frontend",
    next: "Have to do my backend",
    idea: "Happy",
  },
},
{
  date: "January 14, 2025",
  details: {
    done: "Worked on the backend",
    next: "Integrate frontend and backend",
    idea: "Productive day!",
  },
},
];

const PlanetProject: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const project_id = location.state?.project_id;
  const [, setSelectedDate] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<{
    done: string;
    next: string;
    idea: string;
  } | null>(null);

  const handleDateClick = (date: string) => {
    setSelectedDate(date);

    const foundData = calendarMockData.find((data) => data.date === date);
    if (foundData) {
      setSelectedDetails(foundData.details);
    } else {
      setSelectedDetails({
        done: "No data available",
        next: "No data available",
        idea: "No data available",
      });
    }
  };

  const updateField = (field: string, value: string) => {
    if (selectedDetails) {
      setSelectedDetails({
        ...selectedDetails,
        [field]: value,
      });
    }
  };

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
        <ProgressBar />
        <Flex w="100%" gap={4}>
          <StreaksBox 
          project_id={project_id}
          />
          <ScrumSection
            project_id={project_id} // ScrumSection에 projectId 전달
            selectedDetails={selectedDetails}
            onDateClick={handleDateClick}
            updateField={updateField}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default PlanetProject;
