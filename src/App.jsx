import "./App.css";

import datejs from "dayjs";
import useData from "./hooks/useData";

function App() {
  const { currentWeather, data, bestPrice, bestWeatherPrice } = useData();

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
      {bestPrice && bestWeatherPrice && (
        <>
          <p className="best">
            Best price: {parseFloat(bestPrice / 100000).toFixed(2)}€
          </p>
          {/* <p className="best">
            Best price Tomorrow:{" "}
            {parseFloat(bestPriceTomorrow / 100000).toFixed(2)}€
          </p> */}
          <p>
            Best weather price:{" "}
            {parseFloat(bestWeatherPrice / 100000).toFixed(2)}€
          </p>
        </>
      )}
      {data && (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Forecast</th>
              <th>Temp</th>
              <th>Humidity</th>
              <th>Wind</th>
              <th>Clouds</th>
              <th>Price</th>
              <th>Simulated</th>
              <th>Best</th>
            </tr>
          </thead>
          <tbody>
            {data.map(
              ({
                bestPrice,
                bestWeather,
                clouds,
                date,
                description,
                humidity,
                icon,
                price,
                simulatedPrice,
                simulatedWeather,
                temp,
                wind,
              }) => {
                return (
                  <tr key={datejs(date).unix()}>
                    <th scope="row">{datejs(date).format("ddd HH:00")}</th>
                    <td>
                      {icon && (
                        <img
                          src={`http://openweathermap.org/img/w/${icon}.png`}
                          alt={description}
                          width="50"
                          height="50"
                        />
                      )}
                    </td>
                    <td>{temp && parseInt(temp, 10)}°C</td>
                    <td>{humidity && parseInt(humidity, 10)}%</td>
                    <td>{wind}</td>
                    <td>{clouds}</td>
                    <td>{price && parseFloat(price / 100000).toFixed(2)}€</td>
                    <td>
                      {simulatedWeather ? "☀️" : "✅"}{" "}
                      {simulatedPrice ? "💰" : "✅"}
                    </td>
                    <td>
                      {bestWeather && "👕"}
                      {bestPrice && "🟢"}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      )}
      <button onClick={onClick}>Reset Locatiokn</button>
    </main>
  );
}

export default App;
