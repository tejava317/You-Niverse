import React, { useEffect, useState } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";

interface FlightFormProps {
  planetName: string;
  projectName: string;
}



const FlightForm: React.FC<FlightFormProps> = ({ planetName, projectName }) => {
  return (
    <Flex justifyContent="center" alignItems="center" gap={4} w="100%" mb={4}>
      {/* Destination Section */}
      <Box flex="1">
        <Text fontSize="sm" color="gray.400" mb={2}>
          Planet Name
        </Text>
        <Text
          bg="black"
          color="white"
          border="1px solid white"
          h="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="sm"
          borderRadius="0"
        >
          {planetName}
        </Text>
      </Box>

      {/* From Section */}
      <Box flex="1">
        <Text fontSize="sm" color="gray.400" mb={2}>
          Project Name
        </Text>
        <Text
          bg="black"
          color="white"
          border="1px solid white"
          h="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="sm"
          borderRadius="0"
        >
          {projectName}
        </Text>
      </Box>

      {/* GitHub Section - Modified */}
      <Box flex="1">
        <Text fontSize="sm" color="gray.400" mb={2}>
          GitHub
        </Text>
        <Text
          bg="black"
          color="white"
          border="1px solid white"
          h="40px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="sm"
          borderRadius="0"
          px={4}
          overflow="hidden"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          https://github.com/username/repository
        </Text>
      </Box>
    </Flex>
  );
};

export default FlightForm;