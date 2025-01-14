import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleUser } from "../types/GoogleUser";
import { Box, Button, Image, useToast } from "@chakra-ui/react";

interface GoogleLoginProps {
  onLoginSuccess: (user: GoogleUser, githubUsernameMissing: boolean) => void;
  onLoginFailure: (error: string) => void;
}

const GoogleLoginComponent: React.FC<GoogleLoginProps> = ({
  onLoginSuccess,
  onLoginFailure,
}) => {
  const toast = useToast();

  const login = useGoogleLogin({
    flow: "implicit",
    scope: "email profile",
    onSuccess: async (tokenResponse) => {
      try {
        // Fetch user info from Google API
        const response = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        
        // Create user object with ONLY the required fields
        const user: GoogleUser = {
          google_email: data.email,
          nickname: data.name
        };

        console.log("Sending to backend:", user); // Debug log

        const backendResponse = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
          }
        );

        if (!backendResponse.ok) {
          const errorData = await backendResponse.json();
          console.error("Backend error response:", errorData);
          throw new Error(errorData.message || "Failed to save user info to the database");
        }

        const savedUser = await backendResponse.json();
        console.log("Backend success response:", savedUser);

        localStorage.setItem("nickname", savedUser.nickname);
        if (savedUser.user_id) {
          localStorage.setItem("user_id", savedUser.user_id);
        }
        
        if (!savedUser.github_username) {
          onLoginSuccess(savedUser, true);
        } else {
          onLoginSuccess(savedUser, false);
          toast({
            title: "Login Successful",
            description: `Welcome back, ${savedUser.nickname}!`,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error("Error during Google login:", error);
        onLoginFailure(error instanceof Error ? error.message : "Failed to save user info to the database.");
        toast({
          title: "Login Failed",
          description: "Unable to sign in with Google",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      onLoginFailure("Google login failed.");
      toast({
        title: "Login Failed",
        description: "Google sign in failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  return (
    <Box>
      <Button
        w="100%"
        bg="#F2F2F2"
        color="black"
        borderRadius="full"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mb={4}
        _hover={{ bg: "gray.200" }}
        onClick={() => login()}
      >
        <Image src="/images/google.png" alt="Google Icon" boxSize="40px" mr={2} />
        Sign in with Google
      </Button>
    </Box>
  );
};

export default GoogleLoginComponent;