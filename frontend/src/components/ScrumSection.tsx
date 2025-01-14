import React from "react";
import { Box, Text } from "@chakra-ui/react";
import CustomCalendar from "../components/Calender";
import EditableTextBox from "../components/EditableTextBox";

interface ScrumSectionProps {
  project_id: string | undefined;
  selectedDetails: { done: string; todo: string; idea: string } | null;
  onDateClick: (date: string) => void;
  updateField: (field: string, value: string) => void;
}

const ScrumSection: React.FC<ScrumSectionProps> = ({
  project_id,
  selectedDetails,
  onDateClick,
  updateField,
}) => {

  // 로컬 저장소에서 user_id 가져오기
  const user_id = localStorage.getItem("user_id");

  // 현재 선택된 날짜를 관리
  const [selectedDate, setSelectedDate] = React.useState<string>("");

  // 달력에서 날짜를 클릭했을 때 실행
  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    onDateClick(date); // 부모 컴포넌트로 전달
  };

  const handleFieldUpdate = async (field: string, value: string) => {
    if (!user_id || !project_id || !selectedDate) {
      console.error("User ID, Project ID, or Selected Date is missing");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/update-scrum/${user_id}/${project_id}/${field}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scrum_date: selectedDate,
            scrum_update: new Date().toISOString(), // 현재 시간을 ISO 포맷으로 전송
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update field: ${response.statusText}`);
      }

      console.log(`Successfully updated ${field}`);
      updateField(field, value); // 상태 업데이트
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  return (
    <Box flex="2" h="350px">
      <Text fontSize="sm" color="gray.400" mb={2}>
        Scrum
      </Text>
      <Box display="flex" h="100%" border="1px solid white">
        <CustomCalendar onDateClick={handleDateClick} />
        <Box w="50%" h="100%" position="relative">
          {selectedDetails && (
            <>
              <EditableTextBox
                label="Done"
                value={selectedDetails.done}
                onChange={(value) => {
                    handleFieldUpdate("done", value);
                    updateField("done", value); // 프론트에서 즉시 반영
                  }}
                top="0"
              />
              <EditableTextBox
                label="ToDo"
                value={selectedDetails.todo}
                onChange={(value) => {
                    handleFieldUpdate("todo", value);
                    updateField("todo", value); // 프론트에서 즉시 반영
                  }}
                top="33.33%"
              />
              <EditableTextBox
                label="Idea"
                value={selectedDetails.idea}
                onChange={(value) => {
                    handleFieldUpdate("idea", value);
                    updateField("idea", value); // 프론트에서 즉시 반영
                  }}
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
