import React from "react";
import { Box, Progress } from "@chakra-ui/react";

const ProgressBar: React.FC = () => {
  return (
    <Box w="100%" mb={6}>
      <Progress value={50} size="xs" colorScheme="red" />
    </Box>
  );
};

export default ProgressBar;
