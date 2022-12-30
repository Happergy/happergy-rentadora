import dayjs from "dayjs";
import { today } from "../datesMock";

export default function weather() {
  return {
    coord: { lon: -1.1369, lat: 38.0269 },
    weather: [
      { id: 803, main: "Clouds", description: "muy nuboso", icon: "04n" },
    ],
    base: "stations",
    main: {
      temp: 11.39,
      feels_like: 10.31,
      temp_min: 9.7,
      temp_max: 15.25,
      pressure: 1020,
      humidity: 66,
    },
    visibility: 10000,
    wind: { speed: 0.89, deg: 236, gust: 1.79 },
    clouds: { all: 62 },
    dt: today(dayjs(1672356107).format("H")),
    sys: {
      type: 2,
      id: 2037273,
      country: "ES",
      sunrise: 1672384813,
      sunset: 1672419208,
    },
    timezone: 3600,
    id: 2519438,
    name: "Churra",
    cod: 200,
  };
}
