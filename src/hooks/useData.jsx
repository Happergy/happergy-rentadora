import dayjs from "dayjs";
import { useCallback } from "react";
import usePosition from "./usePosition";
import useSWR from "swr";

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

const API_KEY = "4a30997d288e2ad2ace0882245357ff1";
const FORMAT = "YYYYMMDD_HH";

export default function useData() {
  const position = usePosition();

  const fetcher = useCallback(
    ({ url }) => {
      if (!position) {
        return;
      }
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

  const weatherDataList =
    weatherData?.list?.filter((weatherItem) =>
      dayjs(weatherItem.dt * 1000).isBefore(dayjs().add(1, "day").endOf("day"))
    ) || [];

  const data = {};

  const extractWeatherData = (weatherItem) => {
    const key = dayjs(weatherItem.dt * 1000).format(FORMAT);
    data[key] = {
      date: dayjs(weatherItem.dt * 1000).format(),
      temp: weatherItem.main.temp,
      humidity: weatherItem.main.humidity,
      wind: weatherItem.wind.speed,
      clouds: weatherItem.clouds.all,
      icon: weatherItem.weather[0].icon,
      description: weatherItem.weather[0].description,
    };
  };

  if (weatherDataList) {
    weatherDataList.forEach((weatherItem) => {
      extractWeatherData(weatherItem);
    });
  }
  if (currentWeather) {
    extractWeatherData(currentWeather);
  }
  if (prices?.nextPrices) {
    prices.nextPrices.forEach((priceItem) => {
      const key = dayjs(priceItem.date).format(FORMAT);
      data[key] = {
        date: dayjs(priceItem.date).format(),
        price: priceItem.price,
        simulatedPrice: priceItem.simulated,
        ...data[key],
      };
    });
  }

  function compare(a, b) {
    if (a.date < b.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  }

  const sortedData = Object.values(data).sort(compare);

  // fill data with the previous value or next value if there is no data
  for (let i = 0; i < sortedData.length; i++) {
    if (!sortedData[i].temp) {
      sortedData[i].temp = sortedData[i + 1]?.temp || sortedData[i - 1]?.temp;
      sortedData[i].humidity =
        sortedData[i + 1]?.humidity || sortedData[i - 1]?.humidity;
      sortedData[i].wind = sortedData[i + 1]?.wind || sortedData[i - 1]?.wind;
      sortedData[i].clouds =
        sortedData[i + 1]?.clouds || sortedData[i - 1]?.clouds;
      sortedData[i].icon = sortedData[i + 1]?.icon || sortedData[i - 1]?.icon;
      sortedData[i].description =
        sortedData[i + 1]?.description || sortedData[i - 1]?.description;
      sortedData[i].clouds =
        sortedData[i + 1]?.clouds || sortedData[i - 1]?.clouds;
      sortedData[i].simulatedWeather = true;
    }
  }

  console.log(sortedData);

  return {
    currentWeather,
    data: sortedData,
  };
}
