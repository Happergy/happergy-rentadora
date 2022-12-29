import "./App.css";

import { useCallback, useEffect, useState } from "react";

import Prices from "./components/Prices/Prices";
import Weather from "./components/Weather/Weather";
import dayjs from "dayjs";
import usePosition from "./hooks/usePosition";
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
  const position = usePosition();

  const fetcher = useCallback(
    ({ url }) => {
      const queryParams = `?lat=${position.latitude}&lon=${position.longitude}&appid=${API_KEY}&units=metric&lang=es`;
      return fetch(url + queryParams).then((res) => res.json());
    },
    [position]
  );

  const { data: prices } = useSWR(
    "https://api.happergy.es/bestMomentDevices",
    fetcherPOST
  );
  const { data: weatherData } = useSWR(
    { url: "https://api.openweathermap.org/data/2.5/forecast", position },
    fetcher
  );
  const { data: currentWeather } = useSWR(
    { url: "https://api.openweathermap.org/data/2.5/weather", position },
    fetcher
  );

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
              <Weather weatherElement={currentWeather} />
              {weatherData.list
                .filter((weatherItem) =>
                  dayjs(weatherItem.dt * 1000).isBefore(
                    dayjs().add(1, "day").endOf("day")
                  )
                )
                .map((weatherItem) => {
                  return (
                    <>
                      <Weather
                        weatherElement={weatherItem}
                        key={`weather1-${weatherItem.dt}`}
                      />
                      <Weather
                        weatherElement={weatherItem}
                        key={`weather2-${weatherItem.dt}`}
                      />
                    </>
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
