import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Box,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom"; // Import useNavigate

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate(); // Initialize navigate

  const handleLogout = () => {
    // Perform logout logic if needed, such as clearing tokens
    console.log("User logged out"); // Replace with actual logout logic
    navigate("/login"); // Redirect to login page
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered blockScrollOnMount={false}>
      <ModalContent
        bg="black"
        color="white"
        border="1px solid rgba(255, 255, 255, 0.2)"
        borderRadius="0"
        maxW="400px"
        boxShadow="0px 4px 15px rgba(0, 0, 0, 0.7)"
        position="relative"
        zIndex={20001}
      >
        <ModalHeader
          fontSize="2xl"
          fontWeight="bold"
          textAlign="center"
          borderBottom="1px solid rgba(255, 255, 255, 0.2)"
          pb={2}
        >
          User Information
        </ModalHeader>

        <ModalBody>
          <Box px={6} py={4}>
            <Text fontSize="m" fontWeight="medium" mb={4}>
              <Text as="span" color="gray.400">
                User:
              </Text>{" "}
              Jeeyoon Lee
            </Text>
            <Text fontSize="m" fontWeight="medium" mb={4}>
              <Text as="span" color="gray.400">
                Github ID:
              </Text>{" "}
              @jeeyoon38
            </Text>
            <Box fontSize="m" fontWeight="medium" mb={4} display="inline-flex" alignItems="center">
              <Text as="span" color="gray.400" mr={2}>
                Membership:
              </Text>
              <Box mr={2}>Voyager</Box>
              <Tooltip
                label={
                  <Text>
                    Planet 0~2: Explorer
                    <br />
                    Planet 3~5: Pioneer
                    <br />
                    Planet 6~8: Voyager
                  </Text>
                }
                fontSize="sm"
                bg="gray.700"
                color="white"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="0"
                placement="top"
              >
                <InfoOutlineIcon color="gray.400" _hover={{ color: "white" }} />
              </Tooltip>
            </Box>
          </Box>
        </ModalBody>

        <ModalFooter justifyContent="space-between" borderTop="1px solid rgba(255, 255, 255, 0.2)">
          {/* Logout Button */}
          <Button
            onClick={handleLogout} // Call handleLogout on click
            bg="gray.700"
            color="white"
            px={8}
            py={4}
            _hover={{ bg: "red.600" }}
            borderRadius="0"
          >
            Logout
          </Button>

          {/* Close Button */}
          <Button
            onClick={onClose}
            bg="#FF0000"
            color="white"
            px={8}
            py={4}
            _hover={{ bg: "gray.600" }}
            borderRadius="0"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UserInfoModal;
