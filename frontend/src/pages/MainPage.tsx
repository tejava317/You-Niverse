import * as React from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ChangePlanet from "../components/ChangePlanet";
import { IconButton } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { useState } from "react";
import UserInfoModal from "../components/UserInfoModal";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentPlanet, setCurrentPlanet] = React.useState({
    name: "Mercury",
    video: "/images/mercury.mp4",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlanetChange = (planet: { name: string; video: string }) => {
    setCurrentPlanet(planet);
  };

  const handleNavigation = () => {
    navigate("/AddPlanetPage");
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Box
      bgColor="black"
      h="100vh"
      w="100vw"
      overflow="hidden"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* Central Content Box with black background */}
      <Box
        position="relative"
        w="90vw"
        h="90vh"
        minW="1200px"
        minH="600px"
        bgColor="black"
        zIndex={2}
      >
        {/* Change Planet Component */}
        <ChangePlanet onPlanetChange={handlePlanetChange} />

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
              src={currentPlanet.video}
              autoPlay
              loop
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              onDoubleClick={() => navigate("/PlanetProjectPage")}
            />
          </Box>
        </Box>

        {/* Black Box under planet name */}
        <Box
          position="absolute"
          top="79.5%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="150px"
          h="100px"
          bg="black"
          borderTop="0.05px solid rgba(255, 255, 255, 0.2)"
          zIndex={4}
        />

        {/* Header Text */}
        <Box
          position="absolute"
          top="20%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={3}
          textAlign="center"
          w="80%"
        >
          <Text fontSize="5xl" fontWeight="bold" color="white" letterSpacing="-1px">
            To Space and Back
          </Text>
          <Text fontSize="lg" color="gray.400">
            Explore the mysteries of the universe.
          </Text>
        </Box>

        {/* User Icon */}
        <Box position="absolute" top="5px" left="5px" zIndex={5}>
          <IconButton
            icon={<FaUser />}
            aria-label="User Info"
            bg="transparent"
            color="white"
            size="lg"
            _hover={{
              color: "gray.400",
              borderRadius: "0",
              border: "1px solid red",
            }}
            onClick={openModal}
          />
        </Box>

        {/* Next Page Button */}
        <Box
          as="button"
          position="absolute"
          bottom="0"
          right="0"
          zIndex={3}
          bg="#FF0000"
          borderColor="#FF0000"
          w="200px"
          h="50px"
          px="6"
          py="3"
          display="flex"
          alignItems="center"
          pl="20px"
          color="white"
          transition="all 0.3s"
          borderRadius="0"
          _hover={{
            opacity: 0.9,
          }}
          onClick={handleNavigation}
        >
          <Text fontSize="sm">Add a Planet</Text>
        </Box>
      </Box>

      {/* Moon background image */}
      <Image
        src="/images/moon.png"
        alt="Moon Image"
        position="absolute"
        right="-10%"
        top="50%"
        transform="translateY(-50%)"
        objectFit="contain"
        zIndex={1}
      />

      {/* User Info Modal */}
      <UserInfoModal isOpen={isModalOpen} onClose={closeModal} />
    </Box>
  );
};

export default Home;