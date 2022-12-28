import dayjs from "dayjs";
import styles from "./Weather.module.css";

export default function Weather({ weatherElement }) {
  const date = dayjs(weatherElement.dt * 1000);

  return (
    <li className={styles.item}>
      <img
        src={`http://openweathermap.org/img/w/${weatherElement.weather[0].icon}.png`}
        alt={weatherElement.weather[0].description}
        width="50"
        height="50"
      />
      <div className={styles.data}>
        <p>
          {parseInt(weatherElement.main.temp, 10)}°C /
          {weatherElement.main.humidity}%
        </p>
        <p>{date.format("dd HH:mm")}</p>
      </div>
    </li>
  );
}
