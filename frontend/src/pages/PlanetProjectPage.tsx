import React, { useState } from "react";
import { Box, Button, Text, Flex, Select, Progress, Image, IconButton } from "@chakra-ui/react";
import CustomCalendar from "../components/Calender";
import EditableTextBox from "../components/EditableTextBox";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

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

       {/* Back to Main Button */}
       <Button
        as={IconButton}
        position="absolute"
        top="20px"
        left="20px"
        bg="black"
        size="md"
        color="white"
        //border="1px solid white"
        //borderRadius="0"
        aria-label="Back to Main"
        icon={<ArrowBackIcon />} // Use the back icon
        _hover={{ 
          bg: "gray.600",
           borderRadius: "0" ,
          border: "1px solid red"
        }}
         
        onClick={() => navigate("/MainPage")} // Navigate to the main page
      />

      
      {/* Main Container */}
      <Box
        w="90%"
        maxW="1400px"
        h="85vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        gap={6}
      >
        {/* Header */}
        <Text fontSize="4xl" fontWeight="bold" color="white" mb={6}>
          Book your flight
        </Text>

        {/* Form Section */}
        <Flex justifyContent="center" alignItems="center" gap={4} w="100%" mb={4}>
          <Box flex="1">
            <Text fontSize="sm" color="gray.400" mb={2}>
              Destination
            </Text>
            <Select
              bg="black"
              color="white"
              border="1px solid white"
              h="40px"
              fontSize="sm"
              borderRadius="0"
              sx={{
                option: {
                  bg: "black",
                  color: "white",
                  borderRadius: "0",
                  _hover: { bg: "gray.700" },
                },
              }}
            >
              <option value="JFK">JFK, Earth</option>
              <option value="LAX">LAX, Earth</option>
            </Select>
          </Box>
          <Box flex="1">
            <Text fontSize="sm" color="gray.400" mb={2}>
              From
            </Text>
            <Select
              bg="black"
              color="white"
              border="1px solid white"
              h="40px"
              fontSize="sm"
              borderRadius="0"
              sx={{
                option: {
                  bg: "black",
                  color: "white",
                  borderRadius: "0",
                  _hover: { bg: "gray.700" },
                },
              }}
            >
              <option value="JFK">JFK, Earth</option>
              <option value="LAX">LAX, Earth</option>
            </Select>
          </Box>
          <Box flex="1">
            <Text fontSize="sm" color="gray.400" mb={2}>
              Passengers
            </Text>
            <Flex
              bg="black"
              border="1px solid white"
              alignItems="center"
              justifyContent="space-between"
              h="40px"
              px={4}
            >
              <Button
                bg="black"
                color="white"
                _hover={{ bg: "gray.600", border: "1px solid gray" }}
                size="sm"
              >
                -
              </Button>
              <Text fontSize="sm" color="white" mx={4}>
                1
              </Text>
              <Button
                bg="black"
                color="white"
                _hover={{ bg: "gray.600", border :"1px solid gray" }}
                size="sm"
              >
                +
              </Button>
            </Flex>
          </Box>
        </Flex>

        {/* Progress Bar */}
        <Box w="100%" mb={6}>
          <Progress value={50} size="xs" colorScheme="red" />
        </Box>

        <Flex w="100%" gap={4}>
          <Flex flex="1" flexDirection="column" gap={4}>
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
                // animation={
                //   "/images/우주선_step4.png" === "/images/우주선_step4.png"
                //     ? "flyToCornerAnimation 3s ease-in-out infinite"
                //     : "none"
                // }
                // css={{
                //   "@keyframes flyToCornerAnimation": {
                //     "0%": {
                //       transform: "scale(1) translate(0, 0)", // Initial size and position
                //     },
                //     "50%": {
                //       transform: "scale(3) translate(200px, -50px)", // Larger and moving up-right
                //     },
                //     "100%": {
                //       transform: "scale(1) translate(0, 0)", // Back to original
                //     },
                //   },
                // }}
              />

              {/* Star Animation
              {"/images/우주선_step4.png" === "/images/우주선_step4.png" && (
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  w="100%"
                  h="100%"
                  pointerEvents="none"
                  css={{
                    "@keyframes starAnimation": {
                      "0%": {
                        opacity: 1,
                        transform: "scale(1) translate(0, 0) rotate(0deg)",
                      },
                      "100%": {
                        opacity: 0,
                        transform: "scale(1.5) translate(-30px, -30px) rotate(360deg)",
                      },
                    },
                  }}
                >
                  {[...Array(10)].map((_, i) => (
                    <Box
                      key={i}
                      position="absolute"
                      top={`${Math.random() * 100}%`} // Random placement
                      left={`${Math.random() * 100}%`}
                      w="20px"
                      h="20px"
                      animation="starAnimation 2s ease-out infinite"
                      transitionDelay={`${Math.random() * 2}s`} // Stagger animations
                      css={{
                        clipPath:
                          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)", // Star shape
                        backgroundColor: "yellow",
                      }}
                    />
                  ))}
                </Box>
              )} */}

              {/* Streak Text */}
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="white"
                ml="15px" // Add margin to create space between image and text
              >
                Come Back to You:Niverse ㅜㅜ
              </Text>

            </Box>


            </Box>
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
          </Flex>

          {/* Right Side - Scrum Box */}
          <Box flex="2" h="350px">
            <Text fontSize="sm" color="gray.400" mb={2}>
              Scrum
            </Text>
            <Box display="flex" h="100%" border="1px solid white">
              <CustomCalendar onDateClick={handleDateClick} />
              <Box w="50%" h="100%" position="relative">
                {selectedDetails && (
                  <>
                    <EditableTextBox
                      label="Done"
                      value={selectedDetails.done}
                      onChange={(value) => updateField("done", value)}
                      top="0"
                    />
                    <EditableTextBox
                      label="Next"
                      value={selectedDetails.next}
                      onChange={(value) => updateField("next", value)}
                      top="33.33%"
                    />
                    <EditableTextBox
                      label="Idea"
                      value={selectedDetails.idea}
                      onChange={(value) => updateField("idea", value)}
                      top="66.66%"
                    />
                  </>
                )}
              </Box>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default PlanetProject;
