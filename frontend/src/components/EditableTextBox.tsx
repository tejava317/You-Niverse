import React, { useState } from "react";
import { Box, Input, Text } from "@chakra-ui/react";

interface EditableTextBoxProps {
  label: string;
  value: string;
  onChange: (newValue: string) => void;
  top?: string; // Allow a top prop for positioning
}

const EditableTextBox: React.FC<EditableTextBoxProps> = ({
  label,
  value,
  onChange,
  top,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentValue(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    onChange(currentValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setIsEditing(false);
      onChange(currentValue);
    }
  };

  return (
    <Box
      position="absolute"
      top={top} // Apply top dynamically
      left="0"
      right="0"
      height="33.33%" // Equal height for each box
      borderBottom="1px solid white"
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      px={2}
      onDoubleClick={handleDoubleClick}
    >
      <Text fontSize="sm" color="gray.400" mb={1}>
        {label}
      </Text>
      {isEditing ? (
        <Input
          value={currentValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown} // Handle "Enter" key press
          bg="black"
          color="white"
          border="1px solid gray"
          borderRadius="0"
        />
      ) : (
        <Text fontSize="sm" color="white">
          {value}
        </Text>
      )}
    </Box>
  );
};

export default EditableTextBox;
