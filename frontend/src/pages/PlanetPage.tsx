import * as React from 'react';
import { Box, Image, Text } from '@chakra-ui/react';



const Planet: React.FC = () => {

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
      {/* Container to maintain aspect ratio and position */}
      <Box
        position="relative"
        w="1200px"  // Fixed container width
        h="800px"   // Fixed container height
        minW="1200px"
        minH="800px"
      >

        {/* Text above the black box */}
        <Box
          position="absolute"
          top="30%" // Adjust to position the text above the box
          left="50%"
          transform="translate(-50%, -50%)"
          zIndex={3}
          textAlign="center"
        >
          <Text
            fontSize="3xl"
            fontWeight="bold"
            color="white"
          >
            To Space and Back
          </Text>
          <Text 
          fontSize="lg" 
          color="gray.400"
          >
            Explore the mysteries of the universe.
          </Text>
        </Box>


        {/* Black box that will stay centered */}
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          w="1350px"
          h="600px"
          bgColor="black"
          zIndex={2}
        />

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

export default Planet;