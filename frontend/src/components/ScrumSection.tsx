import React from "react";
import { Box, Text } from "@chakra-ui/react";
import CustomCalendar from "../components/Calender";
import EditableTextBox from "../components/EditableTextBox";

interface ScrumSectionProps {
  project_id: string | undefined;
  selectedDetails: { done: string; next: string; idea: string } | null;
  onDateClick: (date: string) => void;
  updateField: (field: string, value: string) => void;
}

const ScrumSection: React.FC<ScrumSectionProps> = ({
  project_id,
  selectedDetails,
  onDateClick,
  updateField,
}) => {
  return (
    <Box flex="2" h="350px">
      <Text fontSize="sm" color="gray.400" mb={2}>
        Scrum
      </Text>
      <Box display="flex" h="100%" border="1px solid white">
        <CustomCalendar onDateClick={onDateClick} />
        <Box w="50%" h="100%" position="relative">
          {selectedDetails && (
            <>
              <EditableTextBox
                label="Done"
                value={selectedDetails.done}
                onChange={(value) => updateField("done", value)}
                top="0"
              />
              <EditableTextBox
                label="Next"
                value={selectedDetails.next}
                onChange={(value) => updateField("next", value)}
                top="33.33%"
              />
              <EditableTextBox
                label="Idea"
                value={selectedDetails.idea}
                onChange={(value) => updateField("idea", value)}
                top="66.66%"
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ScrumSection;
