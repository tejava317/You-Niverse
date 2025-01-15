import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Text,
} from "@chakra-ui/react";

interface GitHubUsernameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (githubUsername: string) => void;
}

const GitHubUsernameModal: React.FC<GitHubUsernameModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [githubUsername, setGithubUsername] = React.useState("");

  const handleSave = () => {
    onSave(githubUsername);
    setGithubUsername(""); // Clear the input after saving
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent bg="black" color="white" borderRadius="md">
        <ModalHeader>GitHub Username</ModalHeader>
        <ModalBody>
          <Text mb={4}>Please provide your GitHub username to proceed:</Text>
          <Input
            placeholder="Enter GitHub username"
            value={githubUsername}
            onChange={(e) => setGithubUsername(e.target.value)}
            bg="gray.700"
            color="white"
            borderRadius="full"
            _placeholder={{ color: "gray.400" }}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            onClick={handleSave}
            isDisabled={!githubUsername.trim()} // Disable if input is empty
          >
            Save and Continue
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default GitHubUsernameModal;
