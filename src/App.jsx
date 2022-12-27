import "./App.css";

import { useCallback, useEffect, useState } from "react";

import Prices from "./components/Prices/Prices";
import Weather from "./components/Weather/Weather";
import dayjs from "dayjs";
import useSWR from "swr";

const API_KEY = "4a30997d288e2ad2ace0882245357ff1";

const fetcherPOST = (url) =>
  fetch(url, {
    method: "post",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({
      tariff: "PCB",
      config: [{}],
    }),
  }).then((res) => res.json());

function App() {
  const [position, setPosition] = useState({ lat: 41.387277, lon: 2.170064 });

  const fetcher = useCallback(
    (url) => {
      const queryParams = `?lat=${position.lat}&lon=${position.lon}&appid=${API_KEY}&units=metric&lang=es`;
      return fetch(url + queryParams).then((res) => res.json());
    },
    [position]
  );

  const { data: prices } = useSWR(
    "https://api.happergy.es/bestMomentDevices",
    fetcherPOST
  );
  const { data: weatherData } = useSWR(
    "https://api.openweathermap.org/data/2.5/forecast",
    fetcher
  );
  const { data: currentWeather } = useSWR(
    "https://api.openweathermap.org/data/2.5/weather",
    fetcher
  );

  useEffect(() => {
    try {
      const location = localStorage.getItem("location");
      if (location) {
        setPosition(JSON.parse(location));
      } else {
        navigator.geolocation.getCurrentPosition((position) => {
          const { latitude, longitude } = position.coords;
          setPosition({
            lat: latitude,
            lon: longitude,
          });
          localStorage.setItem(
            "location",
            JSON.stringify({
              lat: latitude,
              lon: longitude,
            })
          );
        });
      }
    } catch (error) {
      const DEFAULT_POSITION = { lat: 38.027106, lon: -1.139693 };
      setPosition(DEFAULT_POSITION);
    }
  }, []);

  // useEffect(() => {
  //   if (!position) {
  //     return;
  //   }

  //   const queryParams = `lat=${position.lat}&lon=${position.lon}&appid=${API_KEY}&units=metric&lang=es`;
  //   fetch(`https://api.openweathermap.org/data/2.5/forecast?${queryParams}`)
  //     .then((response) => response.json())
  //     .then((data) => setWeatherData(data));

  //   fetch(`https://api.openweathermap.org/data/2.5/weather?${queryParams}`)
  //     .then((response) => response.json())
  //     .then((data) => setCurrentWeather(data));
  // }, [position]);

  const onClick = () => {
    localStorage.removeItem("location");
    window.location.reload();
  };

  return (
    <main className="App">
      {weatherData && currentWeather && (
        <>
          <h2 className="title">{currentWeather.name}</h2>
          <p className="current">
            <img
              src={`http://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
              alt={currentWeather.weather[0].description}
              width="50"
              height="50"
            />
            {parseInt(currentWeather.main.temp, 10)}°C /{" "}
            {currentWeather.main.humidity}%
          </p>
          <div className="data">
            <ul>
              {weatherData.list
                .filter((weatherItem) =>
                  dayjs(weatherItem.dt * 1000).isBefore(dayjs().add(1, "day"))
                )
                .map((weatherItem) => {
                  return (
                    <Weather
                      weatherElement={weatherItem}
                      key={weatherItem.dt}
                    />
                  );
                })}
            </ul>
            <ul>
              <Prices prices={prices?.nextPrices} />
            </ul>
          </div>
        </>
      )}
      <button onClick={onClick}>Reset Locatiokn</button>
    </main>
  );
}

export default App;
