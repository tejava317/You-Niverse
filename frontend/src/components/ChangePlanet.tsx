import React, { useState, useEffect } from "react";
import { IconButton, Box, Image, Text } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

// 행성 데이터
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

// 고정 위치 데이터
const fixedPositions = [
  { top: "48%", left: "7%" },  // 왼쪽 첫번째
  { top: "48%", left: "22%" }, // 왼쪽 두번째
  { top: "48%", left: "78%" }, // 오른쪽 첫번째
  { top: "48%", left: "93%" }, // 오른쪽 두번째
];

interface ChangePlanetProps {
  onPlanetChange: (planet: { name: string; video: string }) => void;
}

const getProjectCountFromIndexedDB = async (): Promise<number> => {
  return new Promise((resolve) => setTimeout(() => resolve(4), 500));
};

const FilteredPlanets = (projectCount: number) => {
  return planetData.slice(0, projectCount);
};

const ChangePlanet: React.FC<ChangePlanetProps> = ({ onPlanetChange }) => {
  const [currentIndex, setCurrentIndex] = useState(2); // 초기값을 2로 설정하여 달이 중앙에 오도록
  const [filteredPlanets, setFilteredPlanets] = useState(planetData);

  useEffect(() => {
    const fetchProjects = async () => {
      const projectCount = await getProjectCountFromIndexedDB();
      const planets = FilteredPlanets(projectCount);
      setFilteredPlanets(planets);
    };
    fetchProjects();
  }, []);

  const handleNext = () => {
    if (currentIndex < filteredPlanets.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      onPlanetChange(filteredPlanets[newIndex]);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      onPlanetChange(filteredPlanets[newIndex]);
    }
  };

  // 현재 표시할 행성들 계산
  const getVisiblePlanets = () => {
    const leftPlanets = [];
    const rightPlanets = [];

    // 왼쪽 행성들 (현재 인덱스 이전)
    for (let i = Math.max(0, currentIndex - 2); i < currentIndex; i++) {
      leftPlanets.push(filteredPlanets[i]);
    }

    // 오른쪽 행성들 (현재 인덱스 이후)
    for (let i = currentIndex + 1; i < Math.min(filteredPlanets.length, currentIndex + 3); i++) {
      rightPlanets.push(filteredPlanets[i]);
    }

    return { leftPlanets, rightPlanets };
  };

  const { leftPlanets, rightPlanets } = getVisiblePlanets();
  const centralPlanet = filteredPlanets[currentIndex];

  return (
    <>
      {/* Navigation Buttons */}
      <IconButton
        icon={<ArrowBackIcon />}
        aria-label="Previous Planet"
        position="absolute"
        bottom="42%"
        left="35%"
        w="40px"
        h="40px"
        borderRadius="50%"
        bg="black"
        border="0.05px solid rgba(255, 255, 255, 0.2)"
        color="white"
        zIndex={5}
        onClick={handleBack}
        isDisabled={currentIndex === 0}
        _hover={{ bg: "gray.600" }}
      />

      <IconButton
        icon={<ArrowForwardIcon />}
        aria-label="Next Planet"
        position="absolute"
        bottom="42%"
        left="62%"
        w="40px"
        h="40px"
        borderRadius="50%"
        bg="black"
        border="0.05px solid rgba(255, 255, 255, 0.2)"
        color="white"
        zIndex={5}
        onClick={handleNext}
        isDisabled={currentIndex === filteredPlanets.length - 1}
        _hover={{ bg: "gray.600" }}
      />

      {/* Left Planets */}
      {leftPlanets.map((planet, index) => (
        <Box
          key={`left-${index}`}
          position="absolute"
          top={fixedPositions[index]?.top || "50%"}
          left={leftPlanets.length === 1 ? "18.5%" : fixedPositions[index]?.left || "50%"}
          transform="translate(-50%, 0)"
          w="13vh"
          h="auto"
          zIndex={5}
        >
          <Box
            w="100%"
            h="13vh"
            borderRadius="50%"
            overflow="hidden"
            bg="transparent"
          >
            <Image
              src={planet.image}
              alt={planet.name}
              objectFit="cover"
              w="100%"
              h="100%"
            />
          </Box>
          <Text
            color="white"
            fontSize="sm"
            textAlign="center"
            mt="8px"
            fontFamily="Krona One"
            letterSpacing="1px"
          >
            {planet.name}
          </Text>
        </Box>
      ))}

      {/* Right Planets */}
      {rightPlanets.map((planet, index) => (
        <Box
          key={`right-${index}`}
          position="absolute"
          top={fixedPositions[index + 2]?.top || "50%"}
          left={rightPlanets.length === 1 ? "81.5%" : fixedPositions[index + 2]?.left || "50%"}
          transform="translate(-50%, 0)"
          w="13vh"
          h="auto"
          zIndex={5}
        >
          <Box
            w="100%"
            h="13vh"
            borderRadius="50%"
            overflow="hidden"
            bg="transparent"
          >
            <Image
              src={planet.image}
              alt={planet.name}
              objectFit="cover"
              w="100%"
              h="100%"
            />
          </Box>
          <Text
            color="white"
            fontSize="sm"
            textAlign="center"
            mt="8px"
            fontFamily="Krona One"
            letterSpacing="1px"
          >
            {planet.name}
          </Text>
        </Box>
      ))}

      {/* Black Box with Top Border */}
      <Box
        position="absolute"
        top="81%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="180px"
        h="60px"
        bg="black"
        borderTop="1px solid rgba(255, 255, 255, 0.2)"
        zIndex={5}
      />

      {/* Central Planet Name */}
      <Text
        position="absolute"
        top="81%"
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

      {/* Circular Line with Video */}
      <Box
        position="absolute"
        top="55%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="350px"
        h="350px"
        border="0.05px solid rgba(255, 255, 255, 0.2)"
        borderRadius="50%"
        overflow="hidden"
        zIndex={4}
      >
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="250px"
          h="250px"
        >
          <video
            src={centralPlanet.video}
            autoPlay
            loop
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default ChangePlanet;