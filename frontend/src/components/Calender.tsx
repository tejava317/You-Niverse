import React, { useState } from "react";
import { Box, Button, Text, Grid, GridItem, Flex } from "@chakra-ui/react";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface CustomCalendarProps {
  onDateClick: (date: string) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ onDateClick }) => {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleDateClick = (date: number) => {
    setSelectedDate(date);
    const fullDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      date
    ).toLocaleDateString("en", { year: "numeric", month: "long", day: "numeric" });

    onDateClick(fullDate); // Pass the full date to the parent
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const emptyStartCells = firstDayOfMonth; // Empty cells before the first day
  const totalCells = Math.ceil((emptyStartCells + daysInMonth) / 7) * 7; // Ensure full weeks

  return (
    <Box
      w="50%"
      h="100%"
      p={4}
      borderRight="1px solid white"
      display="flex"
      flexDirection="column"
    >
      {/* Month Navigation */}
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <Button
          size="sm"
          color="white"
          bg="transparent"
          _hover={{ bg: "gray.700" }}
          onClick={handlePreviousMonth}
        >
          &lt;
        </Button>
        <Text fontSize="lg" color="white" fontWeight="bold">
          {currentDate.toLocaleString("en", { month: "long" })} {year}
        </Text>
        <Button
          size="sm"
          color="white"
          bg="transparent"
          _hover={{ bg: "gray.700" }}
          onClick={handleNextMonth}
        >
          &gt;
        </Button>
      </Flex>

      {/* Days of the Week */}
      <Grid
        templateColumns="repeat(7, 1fr)"
        w="100%"
        borderBottom="1px solid white"
        pb={2}
        mb={2}
      >
        {daysOfWeek.map((day) => (
          <GridItem key={day} textAlign="center">
            <Text fontSize="sm" color="gray.400">
              {day}
            </Text>
          </GridItem>
        ))}
      </Grid>

      {/* Dates */}
      <Grid templateColumns="repeat(7, 1fr)" w="100%">
        {Array.from({ length: totalCells }).map((_, index) => {
          const date = index - emptyStartCells + 1;

          return (
            <GridItem
              key={index}
              borderBottom={
                index < totalCells - 7 ? "1px solid white" : "none" // Bottom border for all rows except the last
              }
              borderRight={(index + 1) % 7 !== 0 ? "1px solid white" : "none"} // Right border for all columns except the last
            >
              {date > 0 && date <= daysInMonth ? (
                <Button
                  variant="unstyled"
                  h="40px"
                  w="100%"
                  textAlign="center"
                  fontSize="sm"
                  position="relative"
                  color={
                    index % 7 === 0 || index % 7 === 6 ? "red.500" : "white"
                  } // Sundays and Saturdays in red
                  _hover={{
                    bg: "gray.700",
                  }}
                  _focus={{
                    boxShadow: "none", // Removes rectangular focus outline
                    outline: "none",
                  }}
                  onClick={() => handleDateClick(date)}
                >
                  {date}
                  {selectedDate === date && (
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      w="30px"
                      h="30px"
                      bg="transparent"
                      border="2px solid white"
                      borderRadius="50%"
                    />
                  )}
                </Button>
              ) : (
                <Box h="40px" w="100%" />
              )}
            </GridItem>
          );
        })}
      </Grid>
    </Box>
  );
};

export default CustomCalendar;
