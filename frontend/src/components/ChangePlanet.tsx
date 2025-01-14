import React, { useState } from "react";
import { IconButton, Box, Image, Text } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

const planetData = [
  { name: "Mercury", video: "/images/mercury.mp4", image: "/images/mercury.png" },
  { name: "Venus", video: "/images/venus.mp4", image: "/images/venus.png" },
  { name: "Moon", video: "/images/example.mp4", image: "/images/moonImage.png" },
  { name: "Mars", video: "/images/mars.mp4", image: "/images/mars.png" },
  { name: "Jupiter", video: "/images/jupiter.mp4", image: "/images/jupiter.png" },
  { name: "Saturn", video: "/images/saturn.mp4", image: "/images/saturn.png" },
  { name: "Uranus", video: "/images/uranus.mp4", image: "/images/uranus.png" },
  { name: "Neptune", video: "/images/neptune.mp4", image: "/images/neptune.png" },
];

const fixedPositions = [
  { top: "48%", left: "7%" },
  { top: "48%", left: "22%" },
  { top: "48%", left: "78%" },
  { top: "48%", left: "93%" },
];

interface ChangePlanetProps {
  onPlanetChange: (planet: { name: string; video: string }) => void;
}

const ChangePlanet: React.FC<ChangePlanetProps> = ({ onPlanetChange }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % planetData.length;
    setCurrentIndex(newIndex);
    onPlanetChange(planetData[newIndex]);
  };

  const handleBack = () => {
    const newIndex = (currentIndex - 1 + planetData.length) % planetData.length;
    setCurrentIndex(newIndex);
    onPlanetChange(planetData[newIndex]);
  };

  const getCircularIndex = (offset: number) =>
    (currentIndex + offset + planetData.length) % planetData.length;

  const centralPlanet = planetData[currentIndex];
  const sideImages = [
    planetData[getCircularIndex(-2)],
    planetData[getCircularIndex(-1)],
    planetData[getCircularIndex(1)],
    planetData[getCircularIndex(2)],
  ];

  return (
    <>
      {/* Navigation Buttons */}
      <IconButton
        icon={<ArrowBackIcon />}
        aria-label="Previous Planet"
        position="absolute"
        bottom="42%"
        left="34%"
        w="40px"
        h="40px"
        borderRadius="50%"
        bg="black"
        border="0.05px solid rgba(255, 255, 255, 0.2)"
        color="white"
        zIndex={5}
        onClick={handleBack}
        _hover={{ bg: "gray.600" }}
      />

      <IconButton
        icon={<ArrowForwardIcon />}
        aria-label="Next Planet"
        position="absolute"
        bottom="42%"
        left="63%"
        w="40px"
        h="40px"
        borderRadius="50%"
        bg="black"
        border="0.05px solid rgba(255, 255, 255, 0.2)"
        color="white"
        zIndex={5}
        onClick={handleNext}
        _hover={{ bg: "gray.600" }}
      />

      {sideImages.map((planet, index) => (
        <Box
          key={index}
          position="absolute"
          top={planet.name === "Saturn" ? "38%" : fixedPositions[index].top}
          left={fixedPositions[index].left}
          transform="translate(-50%, 0)"
          w={planet.name === "Saturn" ? "30vh" : "13vh"}
          h="auto"
          zIndex={5}
        >
          <Box
            w="100%"
            h={planet.name === "Saturn" ? "28vh" : "13vh"}
            borderRadius="50%"
            overflow="hidden"
            bg="transparent"
          >
            <Image
              src={planet.image}
              alt={planet.name}
              objectFit={planet.name === "Saturn" ? "contain" : "cover"}
              p={planet.name === "Saturn" ? "30px" : "0"}
              w="100%"
              h="100%"
            />
          </Box>
          <Text
            color="white"
            fontSize="sm"
            textAlign="center"
            mt={planet.name === "Saturn" ? "8vh" : "8px"}
            position="relative"
            top={planet.name === "Saturn" ? "-14vh" : "0"}
            fontFamily="Krona One"
            letterSpacing="1px"
          >
            {planet.name}
          </Text>
        </Box>
      ))}

      {/* Central Planet Name */}
      <Text
        position="absolute"
        top="78%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="white"
        fontSize="xl"
        fontWeight="medium"
        zIndex={9999}
        pointerEvents="none"
      >
        {centralPlanet.name}
      </Text>
    </>
  );
};

export default ChangePlanet;