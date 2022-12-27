import { useEffect, useState } from "react";

import dayjs from "dayjs";

export default function Prices({ prices = [] }) {
  return prices.map(({ price, simulated, date }) => (
    <li key={date}>
      {price / 100000}€ ({dayjs(date).format("dd HH:mm")}){" "}
      {simulated ? "🟡" : "🟢"}
    </li>
  ));
}
