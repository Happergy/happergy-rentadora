import dayjs from "dayjs";
import { useCallback } from "react";
import usePosition from "./usePosition";
import useSWR from "swr";

const fetcherPrices = (url) =>
  fetch(url, {
    method: "get",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
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
    "https://raw.githubusercontent.com/Happergy/happergy-prices/main/data/happergy.json",
    fetcherPrices
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

  console.log("prices", prices);
  const { pvpc } = prices || {};
  console.log("pvpc", pvpc);
  if (pvpc?.nextPrices) {
    // extend data with prices and simulated prices if available
    // adding to the price the next price to get the price for the two hours duration
    for (let i = 0; i < pvpc.nextPrices.length; i++) {
      const key = dayjs(pvpc.nextPrices[i].date).format(FORMAT);
      data[key] = {
        date: dayjs(pvpc.nextPrices[i].date).format(),
        price: pvpc.nextPrices[i].price,
        simulatedPrice: pvpc.nextPrices[i].simulated,
        ...data[key],
      };
      if (pvpc.nextPrices[i + 1]) {
        data[key].price =
          pvpc.nextPrices[i].price + pvpc.nextPrices[i + 1].price;
      } else {
        data[key].price = pvpc.nextPrices[i].price * 2;
      }
    }
  }

  console.log("data", data);
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
  let bestPriceToday;
  let bestPriceTomorrow;
  let bestWeatherPriceToday;
  let bestWeatherPriceTomorrow;

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

    const getBestPrice = (targetPrices) =>
      targetPrices.reduce((minIndex, item, index, array) => {
        if (item.price < array[minIndex].price) {
          return index;
        }
        return minIndex;
      }, 0);

    const getBestWeather = (targetPrices) =>
      targetPrices.reduce((minIndex, item, index, array) => {
        if (item.humidity < array[minIndex].humidity) {
          return index;
        }
        return minIndex;
      }, 0);

    const isToday = ({ date }) => dayjs(date).isBefore(dayjs().endOf("day"));
    const isTomorrow = ({ date }) => dayjs(date).isAfter(dayjs().endOf("day"));

    // find the index in the array sortedData with the lowest price
    const bestPriceIndexToday = getBestPrice(sortedData.filter(isToday));
    sortedData[bestPriceIndexToday].bestPrice = true;
    // bestPriceToday = sortedData[bestPriceIndexToday].price;
    bestPriceToday = prices.pvpcToday.bestPrice;

    // find the index in the array sortedData with the lowest price
    const bestPriceIndexTomorrow = getBestPrice(sortedData.filter(isTomorrow));
    sortedData[bestPriceIndexTomorrow].bestPrice = true;
    // bestPriceTomorrow = sortedData[bestPriceIndexTomorrow].price;
    bestPriceTomorrow = prices.pvpcTomorrow.bestPrice;

    // find the index in the array sortedData with the lowest humidity and highest temperature
    const bestWeatherIndexToday = getBestWeather(sortedData.filter(isToday));
    if (sortedData[bestWeatherIndexToday]) {
      sortedData[bestWeatherIndexToday].bestWeather = true;
      bestWeatherPriceToday = sortedData[bestWeatherIndexToday].price;
    }

    const bestWeatherIndexTomorrow = getBestWeather(
      sortedData.filter(isTomorrow)
    );
    if (sortedData[bestWeatherIndexTomorrow]) {
      sortedData[bestWeatherIndexTomorrow].bestWeather = true;
      bestWeatherPriceTomorrow = sortedData[bestWeatherIndexTomorrow].price;
    }
  }

  return {
    currentWeather,
    data: sortedData,
    bestPriceToday,
    bestPriceTomorrow,
    bestWeatherPriceToday,
    bestWeatherPriceTomorrow,
  };
}
