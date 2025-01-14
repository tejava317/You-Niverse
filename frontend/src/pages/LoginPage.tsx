import * as React from 'react';
import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import { FaUser, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import GoogleLoginComponent from '../components/GoogleLogin';
import { GoogleUser } from '../types/GoogleUser';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  // State to store username and password
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login submission
  const handleSignIn = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Login Successful!',
          description: `Welcome back, ${data.nickname}!`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/MainPage'); // Navigate to the Main Page on success
      } else {
        const errorData = await response.json();
        toast({
          title: 'Login Failed',
          description: errorData.message || 'Invalid username or password.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      toast({
        title: 'Network Error',
        description: 'Unable to connect to the server.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle navigation to Create Account Page
  const handleCreateAccount = () => {
    navigate('/CreateAccountPage');
  };

  // Handle Google login success
  const handleGoogleLoginSuccess = (user: GoogleUser) => {
    console.log('Google login successful:', user);
    navigate('/MainPage');
  };

  // Handle Google login failure
  const handleGoogleLoginFailure = (error: string) => {
    console.error('Google login failed:', error);
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
      justifyContent="flex-start"
      pl="10%"
    >
      {/* Main Container */}
      <Box position="relative" w="400px" p={8} bg="black" borderRadius="md" zIndex={3} textAlign="center">
        {/* Login Header */}
        <Text fontSize="2xl" fontWeight="bold" color="white" mb={8}>
          Login to Your Space
        </Text>

        {/* Username Input */}
        <InputGroup mb={4}>
          <InputLeftElement pointerEvents="none" color="gray.400">
            <FaUser />
          </InputLeftElement>
          <Input
            name="username"
            placeholder="USER"
            bg="gray.700"
            color="white"
            value={formData.username}
            onChange={handleChange}
            _placeholder={{ color: 'gray.400', fontSize: 'sm', fontWeight: 'normal' }}
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
            name="password"
            placeholder="PASSWORD"
            type="password"
            bg="gray.700"
            color="white"
            value={formData.password}
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
          onClick={handleSignIn}
        >
          Sign In
        </Button>

        {/* OR Divider */}
        <Text color="gray.400" mb={4}>
          or
        </Text>

        {/* Google Sign In Button */}
        <GoogleLoginComponent
          onLoginSuccess={handleGoogleLoginSuccess}
          onLoginFailure={handleGoogleLoginFailure}
        />

        {/* Create an Account Button */}
        <Text fontSize="sm" color="gray.400" mb={2}>
          Don't have an account?
        </Text>
        <Button
          w="100%"
          bg="transparent"
          border="1px solid white"
          color="white"
          borderRadius="full"
          _hover={{ bg: 'white', color: 'black' }}
          onClick={handleCreateAccount}
        >
          Create an Account
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

export default Login;
