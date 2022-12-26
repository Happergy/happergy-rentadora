import "./App.css";

import { useEffect, useState } from "react";

import Temp from "./components/Temp/Temp";
import dayjs from "dayjs";

const API_KEY = "4a30997d288e2ad2ace0882245357ff1";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [position, setPosition] = useState({ lat: 38.027106, lon: -1.139693 });

  useEffect(() => {
    try {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    } catch (error) {
      const DEFAULT_POSITION = { lat: 38.027106, lon: -1.139693 };
      setPosition(DEFAULT_POSITION);
    }
  }, []);

  useEffect(() => {
    if (!position) {
      return;
    }

    const queryParams = `lat=${position.lat}&lon=${position.lon}&appid=${API_KEY}&units=metric&lang=es`;
    fetch(`https://api.openweathermap.org/data/2.5/forecast?${queryParams}`)
      .then((response) => response.json())
      .then((data) => setWeatherData(data));

    fetch(`https://api.openweathermap.org/data/2.5/weather?${queryParams}`)
      .then((response) => response.json())
      .then((data) => setCurrentWeather(data));
  }, [position]);

  return (
    <div className="App">
      <header className="App-header">
        {weatherData && (
          <>
            <div className="title">
              <img
                src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
                alt={currentWeather.weather[0].description}
              />
              {currentWeather.name}
            </div>
            <p>
              {parseInt(currentWeather.main.temp, 10)}°C /{" "}
              {currentWeather.main.humidity}%
            </p>

            {weatherData.list
              .filter((weatherItem) =>
                dayjs(weatherItem.dt * 1000).isBefore(dayjs().add(1, "day"))
              )
              .map((weatherItem) => {
                return (
                  <Temp weatherElement={weatherItem} key={weatherItem.dt} />
                );
              })}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
