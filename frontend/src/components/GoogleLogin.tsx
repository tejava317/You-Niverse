import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { GoogleUser } from "../types/GoogleUser";
import { Box, Button, Image, useToast } from "@chakra-ui/react";

interface GoogleLoginProps {
  onLoginSuccess: (user: GoogleUser) => void;
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

        const user: GoogleUser = {
          google_email: data.email,
          nickname: data.name,
        };

        // Send user info to backend to store in MongoDB
        const backendResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        if (backendResponse.ok) {
          const savedUser = await backendResponse.json();
          onLoginSuccess(savedUser);
          toast({
            title: "Login Successful",
            description: "Welcome to You:Niverse!",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          throw new Error("Failed to save user info to the database");
        }
      } catch (error) {
        console.error("Error during Google login:", error);
        onLoginFailure("Failed to save user info to the database.");
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
        onClick={() => login()} // Trigger Google login flow
      >
        <Image src="/images/google.png" alt="Google Icon" boxSize="40px" mr={2} />
        Sign in with Google
      </Button>
    </Box>
  );
};

export default GoogleLoginComponent;
