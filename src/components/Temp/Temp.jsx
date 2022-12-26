import styles from "./Temp.module.css";

export default function Temp({ weatherElement }) {
  const date = new Date(weatherElement.dt * 1000);

  return (
    <p className={styles.item}>
      <img
        src={`http://openweathermap.org/img/w/${weatherElement.weather[0].icon}.png`}
        alt={weatherElement.weather[0].description}
      />
      {parseInt(weatherElement.main.temp, 10)}°C /{" "}
      {weatherElement.main.humidity}% ({date.toLocaleString()})
    </p>
  );
}
