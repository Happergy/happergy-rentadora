import "./App.css";

import { useEffect, useState } from "react";

function App() {
  const [weatherData, setWeatherData] = useState(null);

  useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?lat=38.027106&lon=-1.139693&appid=4a30997d288e2ad2ace0882245357ff1&units=metric&lang=es"
    )
      .then((response) => response.json())
      .then((data) => setWeatherData(data));
  }, []);

  const weatherElement = weatherData && weatherData.list[0];

  // show the date in a human readable format
  const date = weatherElement && new Date(weatherElement.dt * 1000);

  return (
    <div className="App">
      <header className="App-header">
        {weatherData && (
          <>
            <div className="title">
              <img
                src={`http://openweathermap.org/img/w/${weatherElement.weather[0].icon}.png`}
                alt={weatherElement.weather[0].description}
              />
              {weatherData.city.name}
            </div>
            <p>
              {parseInt(weatherElement.main.temp, 10)} °C /{" "}
              {weatherElement.main.humidity} %
            </p>
            <p>{date.toLocaleString()}</p>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
