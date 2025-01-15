import * as React from "react";
import { Box, Text, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ChangePlanet from "../components/ChangePlanet";
import { IconButton } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { useState, useEffect } from "react";
import UserInfoModal from "../components/UserInfoModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, setSelectedPlanet] = useState<{ name: string; video: string } | null>(null);
  const [user_id, setUserId] = useState<string>('');

  useEffect(() => {
    // localStorage에서 userId 가져오기
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handlePlanetChange = (planet: { name: string; video: string }) => {
    setSelectedPlanet(planet);
    // 필요한 경우 여기에 추가 로직 구현
  };

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
      <Box
        position="relative"
        w="90vw"
        h="90vh"
        minW="1200px"
        minH="600px"
        bgColor="black"
        zIndex={2}
      >
        <ChangePlanet 
          onPlanetChange={handlePlanetChange}
          user_id={user_id}
        />

        <Box
          position="absolute"
          top="12%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={3}
          textAlign="center"
          w="80%"
        >
          <Text fontSize="5xl" fontWeight="bold" color="white" letterSpacing="-1px">
          Explore You:Niverse
          </Text>
          <Text fontSize="lg" color="gray.400">
          Start your journey and reach for the planets
          </Text>
        </Box>

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
          onClick={() => navigate("/AddPlanetPage")}
        >
          <Text fontSize="sm">
            Add a Planet
            </Text>
            <Box
            as="span"
            display="flex"
            alignItems="center"
            justifyContent="center"
            w="20px"
            h="20px"
            ml="17px"
          >
        {/* 아이콘 컴포넌트 추가 */}
        <FontAwesomeIcon icon={faArrowRight} />
      </Box>
        </Box>
      </Box>

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

      <UserInfoModal isOpen={isModalOpen} onClose={closeModal} />
    </Box>
  );
};

export default Home;