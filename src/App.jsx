import "./App.css";

import SourceTable from "./components/SourceTable/SourceTable";
import useData from "./hooks/useData";

function App() {
  const {
    currentWeather,
    data,
    bestPriceToday,
    bestPriceTomorrow,
    bestWeatherPriceToday,
    bestWeatherPriceTomorrow,
  } = useData();

  const onClick = () => {
    localStorage.removeItem("location");
    window.location.reload();
  };

  return (
    <main className="App">
      {currentWeather && (
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
        </>
      )}
      {bestPriceToday && (
        <p className="best">
          Best price: {parseFloat(bestPriceToday / 100000).toFixed(2)}€
        </p>
      )}
      {bestPriceTomorrow && (
        <p className="best">
          Best price Tomorrow:{" "}
          {parseFloat(bestPriceTomorrow / 100000).toFixed(2)}€
        </p>
      )}
      {bestWeatherPriceToday && bestWeatherPriceTomorrow && (
        <p>
          Today 👕: {parseFloat(bestWeatherPriceToday / 100000).toFixed(2)}€ /{" "}
          Tomorrow 👕:{" "}
          {parseFloat(bestWeatherPriceTomorrow / 100000).toFixed(2)}€
        </p>
      )}

      <SourceTable data={data} />
      <button onClick={onClick}>Reset Locatiokn</button>
    </main>
  );
}

export default App;
