import React, { useState } from "react";
import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { FaUser, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import GoogleLoginComponent from "../components/GoogleLogin";
import GitHubUsernameModal from "../components/GithubModal";
import { GoogleUser } from "../types/GoogleUser";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<{
    nickname: string;
    user_id?: string;
    loginMethod: "google" | "regular";
  } | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle regular login submission
  const handleSignIn = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/user-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem("nickname", data.nickname);
        localStorage.setItem("user_id", data.user_id);

        if (data.github_username) {
          // Save GitHub username if it exists in the database
          localStorage.setItem("github_username", data.github_username);
        }

        setUserDetails({
          nickname: data.nickname,
          user_id: data.user_id, // Store user_id for GitHub modal
          loginMethod: "regular",
        });

        if (!data.github_username) {
          localStorage.setItem("github_username", data.github_username);
          setGithubModalOpen(true); // Show modal if GitHub username is null
        } else {
          navigate("/MainPage");
        }
      } else {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.message || "Invalid username or password.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Network Error",
        description: "Unable to connect to the server.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle Google login success

// Handle Google login success
const handleGoogleLoginSuccess = async (savedUser: GoogleUser, githubUsernameMissing: boolean) => {
  try {
    // Save user data to localStorage
    localStorage.setItem("nickname", savedUser.nickname);
    if (!savedUser.user_id) {
      console.error("No user_id received from Google login");
      throw new Error("Login failed: No user ID received");
    }
    
    // user_id를 localStorage에 저장
    localStorage.setItem("user_id", savedUser.user_id);

  // Save GitHub username to localStorage if it exists
  if (savedUser.github_username) {
    localStorage.setItem("github_username", savedUser.github_username);
  } else {
    localStorage.removeItem("github_username"); // Ensure it is cleared if missing
  }

    // Update user details state
    setUserDetails({
      nickname: savedUser.nickname,
      user_id: savedUser.user_id,
      loginMethod: "google",
    });

    // Check if GitHub username is missing
    if (githubUsernameMissing) {
      setGithubModalOpen(true);
    } else {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${savedUser.nickname}!`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/MainPage");
    }
  } catch (error) {
    console.error("Error handling Google login success:", error);
    toast({
      title: "Login Failed",
      description: "Unable to complete login process",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};

  // Handle Google login failure
  const handleGoogleLoginFailure = (error: string) => {
    console.error("Google login failed:", error);
    toast({
      title: "Login Failed",
      description: "Google login failed. Please try again.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

// Handle GitHub username submission

const handleGithubSave = async (githubUsername: string) => {
  try {
    if (!userDetails?.user_id) {
      throw new Error("User ID is missing. Cannot save GitHub username.");
    }

    // Validate GitHub username (basic validation example)
    const isValidGithubUsername = /^[a-zA-Z0-9-]+$/.test(githubUsername);
    if (!isValidGithubUsername) {
      toast({
        title: "Invalid GitHub Username",
        description: "GitHub username can only contain letters, numbers, and dashes.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const apiUrl = `${import.meta.env.VITE_BACKEND_URL}/api/github/register-github-username/${userDetails.user_id}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        github_username: githubUsername,
      }),
    });

    if (response.ok) {
      // Save GitHub username locally for persistent state
      localStorage.setItem("github_username", githubUsername);

      toast({
        title: "GitHub Username Saved!",
        description: "Your GitHub username has been updated successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setGithubModalOpen(false);
      navigate("/MainPage");
    } else {
      const errorData = await response.json();
      toast({
        title: "Error Saving GitHub Username",
        description: errorData.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  } catch (error) {
    console.error("Error updating GitHub username:", error);
    toast({
      title: "Network Error",
      description: "Unable to connect to the server.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
};

  // Handle navigation to Create Account Page
  const handleCreateAccount = () => {
    navigate("/CreateAccountPage");
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
            placeholder="ID"
            bg="gray.700"
            color="white"
            value={formData.username}
            onChange={handleChange}
            _placeholder={{ color: "gray.400", fontSize: "sm", fontWeight: "normal" }}
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
            _placeholder={{ color: "gray.400", fontSize: "sm", fontWeight: "normal" }}
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
          _hover={{ bg: "red.500" }}
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
          _hover={{ bg: "white", color: "black" }}
          onClick={handleCreateAccount}
        >
          Create an Account
        </Button>
      </Box>

      {/* GitHub Username Modal */}
      <GitHubUsernameModal
        isOpen={githubModalOpen}
        onClose={() => setGithubModalOpen(false)}
        onSave={handleGithubSave}
      />

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
