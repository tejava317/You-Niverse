import * as React from 'react';
import { Box, Button, Image, Input, InputGroup, InputLeftElement, Text, useToast } from '@chakra-ui/react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CreateAccount: React.FC = () => {
  const navigate = useNavigate();

//   const handleLoginPage = () => {
//     navigate('/LoginPage'); // Navigate to the Create Account Page
//   };

const toast = useToast();

  // State to store input values
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    nickname: '', // Add a field for nickname if needed
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSignUp = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user-sign-up`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Account created successfully!',
          description: 'You can now log in.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/LoginPage'); // Navigate to the login page
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error creating account',
          description: errorData.message || 'Something went wrong',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Network error',
        description: 'Failed to connect to the server.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
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
    name="username"
    placeholder="ID"
    bg="gray.700"
    color="white"
    value={formData.username} // Bind the value to the state
    onChange={handleChange}   // Update the state on change
    _placeholder={{
      color: "gray.400",
      fontSize: "sm",
      fontWeight: "normal",
    }}
    border="none"
    borderRadius="full"
  />
</InputGroup>

<InputGroup mb={4}>
  <InputLeftElement pointerEvents="none" color="gray.400">
    <FaLock />
  </InputLeftElement>
  <Input
    name="password"
    placeholder="PASSWORD"
    type="password"
    bg="gray.700"
    color="white"
    value={formData.password} // Bind the value to the state
    onChange={handleChange}   // Update the state on change
    _placeholder={{
      color: "gray.400",
      fontSize: "sm",
      fontWeight: "normal",
    }}
    border="none"
    borderRadius="full"
  />
</InputGroup>

 {/* Nickname Input */}
<InputGroup mb={6}>
          <InputLeftElement pointerEvents="none" color="gray.400">
            <FaUser />
          </InputLeftElement>
          <Input
            name="nickname"
            placeholder="NICKNAME"
            bg="gray.700"
            color="white"
            value={formData.nickname}
            onChange={handleChange}
            _placeholder={{ color: 'gray.400', fontSize: 'sm', fontWeight: 'normal' }}
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
          onClick={handleSignUp}
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
