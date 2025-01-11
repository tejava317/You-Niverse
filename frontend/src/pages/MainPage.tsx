import * as React from 'react';
import { Box, IconButton, Image, Text } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate('/PlanetPage'); // Adjust this path based on your route configuration
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
        w="1200px"
        h="800px"
        minW="1200px"
        minH="800px"
      >
        {/* Circular Line */}
        <Box
          position="absolute"
          top="55%" // Adjust to move it higher or lower
          left="50%"
          transform="translate(-50%, -50%)"
          w="350px" // Circle width
          h="350px" // Circle height
          border="0.05px solid rgba(255, 255, 255, 0.2)" // Circular border
          borderRadius="50%" // Make it circular
          overflow="hidden" // Ensures the video stays within the circle
          zIndex={4} // Ensure it appears above other elements
        >
          <video
            src="/images/example.mp4"
            autoPlay
            loop
            muted
            style={{
              width: '50%',
              height: '50%',
              objectFit: 'cover', // Ensures the video fills the circle
              position: 'absolute',
              top: '25%',
              left: '25%',
            }}
          />
        </Box>

         {/* Circular Button with Left Arrow */}
         <IconButton
          icon={<ArrowBackIcon />} // Left arrow icon
          aria-label="Go back"
          position="absolute"
          bottom="42%" // Adjust position
          left="34%" // Adjust position
          w="40px" // Circle size
          h="40px" // Circle size
          borderRadius="50%" // Makes it circular
          bg="black"
          border="0.05px solid rgba(255, 255, 255, 0.2)"
          color="white"
          zIndex={9999} // Highest zIndex
          _hover={{
            bg: 'gray.600',
          }}
          onClick={handleNavigation}
        />

        <IconButton
          icon={<ArrowForwardIcon />} // Right arrow icon
          aria-label="Go back"
          position="absolute"
          bottom="42%" // Adjust position
          left="63%" // Adjust position
          w="40px" // Circle size
          h="40px" // Circle size
          borderRadius="50%" // Makes it circular
          bg="black"
          border="0.05px solid rgba(255, 255, 255, 0.2)"
          color="white"
          zIndex={9999} // Highest zIndex
          _hover={{
            bg: 'gray.600',
          }}
          onClick={handleNavigation}
        />

        {/* Text above the black box */}
        <Box
          position="absolute"
          top="20%"
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={3}
          textAlign="center"
          w="80%"
        >
          <Text 
          fontSize="5xl"
           fontWeight="bold" 
           color="white"
           letterSpacing="-1px" >
            To Space and Back
          </Text>
          <Text fontSize="lg" color="gray.400">
            Explore the mysteries of the universe.
          </Text>
        </Box>

        {/* Navigation Button */}
       {/* Black box that stays centered */}
        <Box
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="1350px"
        h="700px"
        bgColor="black"
        zIndex={2}
        position="relative" // Set position relative for proper alignment of the child button
        >
        {/* Navigation Button */}
        <Box
            as="button"
            position="absolute"
            bottom="0" // Align the button with the bottom edge of the black box
            right="0" // Align the button with the right edge of the black box
            zIndex={3}
            bg="#FF0000"
            border="2px"
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
            <Text fontSize="sm">Next Page</Text>
        </Box>
        </Box>



        {/* Moon image */}
        <Image
          src={'/images/moon.png'}
          alt="Moon Image"
          position="absolute"
          right="-10%"
          top="50%"
          transform="translateY(-50%)"
          objectFit="contain"
          zIndex={1}
        />
      </Box>
    </Box>
  );
};

export default Home;
