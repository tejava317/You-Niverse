//ChangePlanet.tsx
import React, { useState, useEffect } from "react";
import { IconButton, Box, Image, Text } from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { getProjectsByUserId } from '../utils/db';  // db.ts에서 함수 import

interface Planet {
  name: string;
  video: string;
  image: string;
}

interface Project {
  user_id: string;
  projectName: string;
  project_id: string;
  createdAt: string;
}

// 행성 데이터
const planetData = [
  { name: "Mercury", video: "/images/mercury.mp4", image: "/images/mercury.png" },
  { name: "Venus", video: "/images/venus.mp4", image: "/images/venus.png" },
  { name: "Moon", video: "/images/moon.mp4", image: "/images/moonImage.png" },
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
  user_id: string;
}

const ChangePlanet: React.FC<ChangePlanetProps> = ({ onPlanetChange, user_id }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredPlanets, setFilteredPlanets] = useState<Planet[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        //console.log("Current userId:", user_id);
        
        // localStorage에서 userId 가져오기 시도
        const storedUserId = localStorage.getItem('user_id');
        //console.log("Stored userId:", storedUserId);
        
        const currentUserId = user_id || storedUserId;
        
        if (!currentUserId) {
          //console.log("No userId found");
          setFilteredPlanets([]);
          setLoading(false);
          return;
        }

        // indexedDB에서 프로젝트 데이터 가져오기
        //console.log("Fetching projects for userId:", currentUserId);
        const projectsData = await getProjectsByUserId(currentUserId);
        //console.log("Fetched projects:", projectsData);
        
        // 생성 시간순으로 정렬
        const sortedProjects = projectsData.sort((a: { createdAt: string | number | Date; }, b: { createdAt: string | number | Date; }) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        
        // 정렬된 프로젝트 저장
        setProjects(sortedProjects);
        
        // 프로젝트 수에 맞춰 행성 필터링
        const availablePlanets = planetData.slice(0, sortedProjects.length);
        setFilteredPlanets(availablePlanets);

        // 총 행성 개수를 로컬 저장소에 저장 (한 번만)
        localStorage.setItem("totalPlanets", String(availablePlanets.length));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setFilteredPlanets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user_id]);

  useEffect(() => {
    // 초기 행성 선택
    if (filteredPlanets.length > 0) {
      const selectedPlanet = filteredPlanets[currentIndex];
      onPlanetChange(selectedPlanet);
      localStorage.setItem("currentPlanetName", selectedPlanet.name);
    }
  }, [filteredPlanets, currentIndex, onPlanetChange]);


  const handlePlanetClick = () => {
    const centralProject = projects[currentIndex];
    const currentPlanet = filteredPlanets[currentIndex];
    if (centralProject && currentPlanet) {
      // 로컬 저장소에 currentPlanet.name 저장
      localStorage.setItem("currentPlanetName", currentPlanet.name);
      localStorage.setItem("currentProjectName", centralProject.projectName);


      // PlanetProjectPage로 currentPlanet.name 전달
      navigate("/PlanetProjectPage", {
        state: {
          project_id: centralProject.project_id,
          planetName: currentPlanet.name,
          projectName: centralProject.projectName
        },
      });
    }
  };


  if (loading) {
    return (
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
      >
        <Text color="white">Loading planets...</Text>
      </Box>
    );
  }

  if (!filteredPlanets.length) {
    return (
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        textAlign="center"
      >
        <Text color="white" mb={2}>No projects found.</Text>
        <Text color="gray.400" fontSize="sm">
          Create a project to see planets appear.
        </Text>
      </Box>
    );
  }

  const handleNext = () => {
    if (currentIndex < filteredPlanets.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const getVisiblePlanets = () => {
    const leftPlanets = [];
    const rightPlanets = [];

    for (let i = Math.max(0, currentIndex - 2); i < currentIndex; i++) {
      leftPlanets.push(filteredPlanets[i]);
    }

    for (let i = currentIndex + 1; i < Math.min(filteredPlanets.length, currentIndex + 3); i++) {
      rightPlanets.push(filteredPlanets[i]);
    }

    return { leftPlanets, rightPlanets };
  };

  const { leftPlanets, rightPlanets } = getVisiblePlanets();
  const centralPlanet = filteredPlanets[currentIndex];

  // 프로젝트 이름 가져오기 함수
  const getProjectName = (planetIndex: number): string => {
    if (planetIndex >= 0 && planetIndex < projects.length) {
      return projects[planetIndex].projectName;
    }
    return '';
  };

  return (
    <>
      {/* Previous Button */}
      <IconButton
        icon={<ArrowBackIcon />}
        aria-label="Previous Planet"
        position="absolute"
        bottom="42%"
        left="35.1%"
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

      {/* Next Button */}
      <IconButton
        icon={<ArrowForwardIcon />}
        aria-label="Next Planet"
        position="absolute"
        bottom="42%"
        left="61.9%"
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
          <Text color="gray.300" fontSize="2xs" textAlign="center">
            {getProjectName(filteredPlanets.indexOf(planet))}
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
          <Text color="gray.300" fontSize="2xs" textAlign="center">
            {getProjectName(filteredPlanets.indexOf(planet))}
          </Text>
        </Box>
      ))}

      {/* Central Planet Info */}
      <Box
        position="absolute"
        top="78.5%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="180px"
        h="60px"
        bg="black"
        borderTop="1px solid rgba(255, 255, 255, 0.2)"
        zIndex={5}
      />

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
      <Text
        position="absolute"
        top="82%"
        left="50%"
        transform="translate(-50%, -50%)"
        color="gray.300"
        fontSize="md"
        textAlign="center"
        zIndex={9999}
      >
        {getProjectName(currentIndex)}
      </Text>

      {/* Central Video */}
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
              cursor: "pointer"
            }}
            onDoubleClick={handlePlanetClick}
          />
        </Box>
      </Box>
    </>
  );
};

export default ChangePlanet;