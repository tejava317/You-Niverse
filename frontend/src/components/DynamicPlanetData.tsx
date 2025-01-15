import React, { useEffect } from "react";
import { getProjectsByUserId } from "../utils/db";

interface DynamicPlanetDataProps {
  onDataChange: (data: { name: string; video: string; image: string }[]) => void;
}

const DynamicPlanetData: React.FC<DynamicPlanetDataProps> = ({ onDataChange }) => {
  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    if (user_id) {
      getProjectsByUserId(user_id).then((projects) => {
        const projectCount = projects.length;

        const planetData = [
          { name: "Mercury", video: "/images/mercury.mp4", image: "/images/mercury.png" },
          { name: "Venus", video: "/images/venus.mp4", image: "/images/venus.png" },
          { name: "Moon", video: "/images/example.mp4", image: "/images/moonImage.png" },
          { name: "Mars", video: "/images/mars.mp4", image: "/images/mars.png" },
          { name: "Jupiter", video: "/images/jupiter.mp4", image: "/images/jupiter.png" },
          { name: "Saturn", video: "/images/saturn.mp4", image: "/images/saturn.png" },
          { name: "Uranus", video: "/images/uranus.mp4", image: "/images/uranus.png" },
          { name: "Neptune", video: "/images/neptune.mp4", image: "/images/neptune.png" },
        ];

        const filteredPlanetData = planetData.slice(0, projectCount);
        onDataChange(filteredPlanetData);
      });
    }
  }, [onDataChange]);

  return null;
};

export default DynamicPlanetData;
