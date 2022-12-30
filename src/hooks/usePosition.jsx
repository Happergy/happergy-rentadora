import { useEffect, useState } from "react";

const DEFAULT_POSITION = { latitude: 41.404077, longitude: 2.174992 }; // Barcelona
export default function usePosition() {
  const [position, setPosition] = useState(DEFAULT_POSITION);

  useEffect(() => {
    try {
      const storedPosition = localStorage.getItem("location");
      if (storedPosition) {
        setPosition(JSON.parse(storedPosition));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            localStorage.setItem(
              "location",
              JSON.stringify({ latitude, longitude })
            );
            setPosition({ latitude, longitude });
          },
          () => {
            setPosition(DEFAULT_POSITION);
          }
        );
      }
    } catch (error) {
      setPosition(DEFAULT_POSITION);
    }
  }, []);

  return position;
}
