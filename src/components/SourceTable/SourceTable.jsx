import dayjs from "dayjs";

export default function SourceTable({ data }) {
  return (
    data && (
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
                <tr key={dayjs(date).unix()}>
                  <th scope="row">{dayjs(date).format("ddd HH:00")}</th>
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
                    {simulatedWeather ? "🚧" : "✅"}{" "}
                    {simulatedPrice ? "🚧" : "✅"}
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
    )
  );
}
