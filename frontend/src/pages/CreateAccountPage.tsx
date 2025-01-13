import * as React from 'react';
import { Box, Button, Image, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginPage = () => {
    navigate('/LoginPage'); // Navigate to the Create Account Page
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
      justifyContent="flex-start" // Align the content to the left
      pl="10%" // Add padding to push the container slightly from the left
    >
      {/* Main Container */}
      <Box
        position="relative"
        w="400px"
        p={8}
        bg="black"
        borderRadius="md"
        zIndex={3}
        textAlign="center"
      >
        {/* Login Header */}
        <Text fontSize="2xl" fontWeight="bold" color="white" mb={8}>
          Create Your Space
        </Text>

        {/* User Input */}
        <InputGroup mb={4}>
          <InputLeftElement pointerEvents="none" color="gray.400">
            <FaUser />
          </InputLeftElement>
          <Input
            placeholder="USER"
            bg="gray.700"
            color="white"
            _placeholder={{ color: 'gray.400',
                fontSize:"sm",
                fontWeight:"normal",

             }}
            border="none"
            borderRadius="full"
          />
        </InputGroup>

        {/* Password Input */}
        <InputGroup mb={6}>
          <InputLeftElement pointerEvents="none" color="gray.400">
            <FaLock />
          </InputLeftElement>
          <Input
            placeholder="PASSWORD"
            type="password"
            bg="gray.700"
            color="white"
            _placeholder={{ color: 'gray.400',
                fontSize:"sm",
                fontWeight:"normal",
             }}
            border="none"
            borderRadius="full"
          />
        </InputGroup>

        {/* Sign In Button */}
        <Button
          w="100%"
          bg="red.600"
          color="white"
          borderRadius="full"
          mb={4}
          _hover={{ bg: 'red.500' }}
          onClick={handleLoginPage}
        >
          Sign Up
        </Button>


      </Box>

      {/* Background Moon Image */}
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
    </Box>
  );
};

export default CreateAccount;
