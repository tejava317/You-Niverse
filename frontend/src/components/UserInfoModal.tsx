//UserInfoModal.tsx
import React, { useEffect, useState } from "react";
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
  Link,
} from "@chakra-ui/react";
import { InfoOutlineIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { getProjectsByUserId } from "../utils/db";

interface UserInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string | null>(null);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [projectCount, setProjectCount] = useState<number>(0);
  const [membershipLevel, setMembershipLevel] = useState<string>("Explorer");

  useEffect(() => {
    if (isOpen) {
      const savedNickname = localStorage.getItem("nickname");
      const savedGithubUsername = localStorage.getItem("github_username");
      const user_id = localStorage.getItem("user_id");


      setNickname(savedNickname);
      setGithubUsername(savedGithubUsername);

        if (user_id) {
        // IndexedDB에서 해당 userId의 프로젝트를 가져옴
        getProjectsByUserId(user_id).then((projects) => {
          const projectCount = projects.length;
          setProjectCount(projectCount);

          // 멤버십 레벨 설정
          if (projectCount >= 6) {
            setMembershipLevel("Voyager");
          } else if (projectCount >= 3) {
            setMembershipLevel("Pioneer");
          } else {
            setMembershipLevel("Explorer");
          }
        });
      }
    }
  }, [isOpen]);


  const handleLogout = () => {
    // Clear localStorage when logging out
    localStorage.clear();
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalContent
        bg="black"
        color="white"
        border="1px solid rgba(255, 255, 255, 0.2)"
        borderRadius="0"
        maxW="400px"
        boxShadow="0px 4px 15px rgba(0, 0, 0, 0.7)"
        mx="auto"
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
              {nickname || "Unknown User"}
            </Text>
            <Text fontSize="m" fontWeight="medium" mb={4}>
              <Text as="span" color="gray.400">
                Github ID:
              </Text>{" "}
             {githubUsername ? (
                <Link
                  href={`https://github.com/${githubUsername}`}
                  color="blue.400"
                  isExternal
                >
                  @{githubUsername}
                </Link>
              ) : (
                "Not set"
              )}
            </Text>
            <Text fontSize="m" fontWeight="medium" mb={4}>
              <Text as="span" color="gray.400">
                Total Projects:
              </Text>{" "}
              {projectCount}
            </Text>
            <Box fontSize="m" fontWeight="medium" mb={4} display="inline-flex" alignItems="center">
              <Text as="span" color="gray.400" mr={2}>
                Membership:
              </Text>
              <Box mr={2}>{membershipLevel}</Box>
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
          <Button
            onClick={handleLogout}
            bg="gray.700"
            color="white"
            px={8}
            py={4}
            _hover={{ bg: "red.600" }}
            borderRadius="0"
          >
            Logout
          </Button>

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