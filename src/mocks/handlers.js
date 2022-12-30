import bestMomentDevices from "./happergy/prices.json";
import forecast from "./forecast/forecast.json";
import image04n from "./images/04n.png";
import { rest } from "msw";
import weather from "./weather/weather.json";

export const handlers = [
  rest.get(
    "https://api.openweathermap.org/data/2.5/forecast",
    (_, res, ctx) => {
      return res(ctx.status(200), ctx.json(forecast));
    }
  ),
  rest.get("https://api.openweathermap.org/data/2.5/weather", (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(weather));
  }),
  rest.get("http://openweathermap.org/img/w/*.png", async (_, res, ctx) => {
    const image = await fetch(image04n).then((res) => res.arrayBuffer());
    return res(
      ctx.set("Content-Length", image.byteLength.toString()),
      ctx.set("Content-Type", "image/png"),
      ctx.body(image)
    );
  }),
  rest.post("https://api.happergy.es/bestMomentDevices", (_, res, ctx) => {
    return res(ctx.status(200), ctx.json(bestMomentDevices));
  }),
];
