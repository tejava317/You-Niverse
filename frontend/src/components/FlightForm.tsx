import React from "react";
import { Box, Text, Select, Flex, Button } from "@chakra-ui/react";

const FlightForm: React.FC = () => {
  return (
    <Flex justifyContent="center" alignItems="center" gap={4} w="100%" mb={4}>
      <Box flex="1">
        <Text fontSize="sm" color="gray.400" mb={2}>
          Destination
        </Text>
        <Select
          bg="black"
          color="white"
          border="1px solid white"
          h="40px"
          fontSize="sm"
          borderRadius="0"
          sx={{
            option: { bg: "black", color: "white", _hover: { bg: "gray.700" } },
          }}
        >
          <option value="JFK">JFK, Earth</option>
          <option value="LAX">LAX, Earth</option>
        </Select>
      </Box>
      <Box flex="1">
        <Text fontSize="sm" color="gray.400" mb={2}>
          From
        </Text>
        <Select
          bg="black"
          color="white"
          border="1px solid white"
          h="40px"
          fontSize="sm"
          borderRadius="0"
          sx={{
            option: { bg: "black", color: "white", _hover: { bg: "gray.700" } },
          }}
        >
          <option value="JFK">JFK, Earth</option>
          <option value="LAX">LAX, Earth</option>
        </Select>
      </Box>
      <Box flex="1">
        <Text fontSize="sm" color="gray.400" mb={2}>
          Passengers
        </Text>
        <Flex
          bg="black"
          border="1px solid white"
          alignItems="center"
          justifyContent="space-between"
          h="40px"
          px={4}
        >
          <Button
            bg="black"
            color="white"
            _hover={{ bg: "gray.600", border: "1px solid gray" }}
            size="sm"
          >
            -
          </Button>
          <Text fontSize="sm" color="white" mx={4}>
            1
          </Text>
          <Button
            bg="black"
            color="white"
            _hover={{ bg: "gray.600", border: "1px solid gray" }}
            size="sm"
          >
            +
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default FlightForm;
