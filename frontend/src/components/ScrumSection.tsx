import React, { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import CustomCalendar from "../components/Calender";
import EditableTextBox from "../components/EditableTextBox";

interface ScrumSectionProps {
  project_id: string;
}

const ScrumSection: React.FC<ScrumSectionProps> = ({ project_id }) => {
  const user_id = localStorage.getItem("user_id");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [scrumDetails, setScrumDetails] = useState({
    done: "",
    todo: "",
    idea: "",
  });

  const formatDateToYYYYMMDD = (date: string): string => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // 날짜 클릭 시 실행
  const handleDateClick = (date: string) => {
    console.log("Selected date:", date);
    setSelectedDate(date);
  };

  // DB에서 스크럼 데이터 불러오기
  const loadScrumDetails = async (date: string) => {
    if (!user_id || !project_id) {
      console.error("Missing user_id or project_id");
      return;
    }

    const formattedDate = formatDateToYYYYMMDD(date);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/load-scrum/${user_id}/${project_id}/${formattedDate}`
      );

      if (!response.ok) {
        throw new Error(`Failed to load scrum details: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Loaded scrum details:", data);
      setScrumDetails({
        done: data.done || "",
        todo: data.todo || "",
        idea: data.idea || "",
      });
    } catch (error) {
      console.error("Error loading scrum details:", error);
    }
  };

  // 필드 업데이트
  const handleFieldUpdate = async (field: string, value: string) => {
    if (!user_id || !project_id || !selectedDate) {
      console.error("Missing user_id, project_id, or selectedDate");
      return;
    }

    const formattedDate = formatDateToYYYYMMDD(selectedDate);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/update-scrum/${user_id}/${project_id}/${field}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            scrum_date: formattedDate,
            scrum_update: value,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update field: ${response.statusText}`);
      }

      console.log(`Successfully updated ${field} with value:`, value);
      setScrumDetails((prev) => ({ ...prev, [field]: value }));
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      loadScrumDetails(selectedDate);
    }
  }, [selectedDate]);

  return (
    <Box flex="2" h="350px">
      <Text fontSize="sm" color="gray.400" mb={2}>
        Scrum
      </Text>
      <Box display="flex" h="100%" border="1px solid white">
        <CustomCalendar onDateClick={handleDateClick} />
        <Box w="50%" h="100%" position="relative">
          {scrumDetails && (
            <>
              <EditableTextBox
                label="Done"
                value={scrumDetails.done}
                onChange={(value) => handleFieldUpdate("done", value)}
                top="0"
                
              />
              <EditableTextBox
                label="Todo"
                value={scrumDetails.todo}
                onChange={(value) => handleFieldUpdate("todo", value)}
                top="33.33%"
              />
              <EditableTextBox
                label="Idea"
                value={scrumDetails.idea}
                onChange={(value) => handleFieldUpdate("idea", value)}
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
