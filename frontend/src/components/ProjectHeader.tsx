import React from "react";
import { Text } from "@chakra-ui/react";

const Header: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Text fontSize="4xl" fontWeight="bold" color="white" mb={6}>
      Book your flight
      </Text>
    </div>
  );
};

export default Header;
