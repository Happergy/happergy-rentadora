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
    // extend data with prices and simulated prices if available
    // adding to the price the next price to get the price for the two hours duration
    for (let i = 0; i < prices.nextPrices.length; i++) {
      const key = dayjs(prices.nextPrices[i].date).format(FORMAT);
      data[key] = {
        date: dayjs(prices.nextPrices[i].date).format(),
        price: prices.nextPrices[i].price,
        simulatedPrice: prices.nextPrices[i].simulated,
        ...data[key],
      };
      if (prices.nextPrices[i + 1]) {
        data[key].price =
          prices.nextPrices[i].price + prices.nextPrices[i + 1].price;
      } else {
        data[key].price = prices.nextPrices[i].price * 2;
      }
    }
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
  let bestPrice;
  let bestWeatherPrice;

  if (sortedData.length) {
    // fill forecast data with the next value first or previous value if there is no data
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

    // find the index in the array sortedData with the lowest price
    const bestPriceIndex = sortedData.reduce((minIndex, item, index, array) => {
      if (item.price < array[minIndex].price) {
        return index;
      }
      return minIndex;
    }, 0);
    sortedData[bestPriceIndex].bestPrice = true;
    bestPrice = sortedData[bestPriceIndex].price;

    // find the index in the array sortedData with the lowest humidity and highest temperature
    const bestWeatherIndex = sortedData
      .slice(1)
      .reduce((minIndex, item, index, array) => {
        if (item.humidity < array[minIndex].humidity) {
          return index;
        }
        return minIndex;
      }, 0);
    if (sortedData[bestWeatherIndex + 1]) {
      sortedData[bestWeatherIndex + 1].bestWeather = true;
      bestWeatherPrice = sortedData[bestWeatherIndex + 1].price;
    }
  }

  return {
    currentWeather,
    data: sortedData,
    bestPrice,
    bestWeatherPrice,
  };
}
