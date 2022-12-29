import "./App.css";

import Prices from "./components/Prices/Prices";
import Weather from "./components/Weather/Weather";
import useData from "./hooks/useData";

function App() {
  const { prices, weatherData, currentWeather } = useData();

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
              {weatherData.map((weatherItem) => {
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
