import React, { useEffect, useState } from "react";
import { Box, Text, Button, useToast } from "@chakra-ui/react";

const ProjectCounter: React.FC = () => {
  const [projectCount, setProjectCount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const githubUsername = localStorage.getItem("github_username"); // Get current user
    const savedProjects = JSON.parse(localStorage.getItem("projects") || "[]"); // Get saved projects

    if (!githubUsername) {
      console.warn("GitHub username not found in localStorage.");
      return;
    }

    // Filter projects by matching owner_username
    const userProjects = savedProjects.filter(
      (project: { owner_username: string }) => project.owner_username === githubUsername
    );

    setProjectCount(userProjects.length); // Update the project count

    // Save project count with user_id in localStorage
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      localStorage.setItem(
        "project_count",
        JSON.stringify({ user_id: user_id, project_count: userProjects.length })
      );
    }
  }, []);

  const handleShowCount = () => {
    const savedData = localStorage.getItem("project_count");
    if (savedData) {
      toast({
        title: "Project Count",
        description: `Stored project count: ${savedData}`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    } else {
      toast({
        title: "No Data Found",
        description: "No project count found in localStorage.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={6} textAlign="center" color="white">
      <Text fontSize="lg" mb={4}>
        Total Projects: {projectCount}
      </Text>
      <Button colorScheme="teal" onClick={handleShowCount}>
        Show Stored Project Count
      </Button>
    </Box>
  );
};

export default ProjectCounter;
