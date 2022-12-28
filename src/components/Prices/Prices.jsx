import dayjs from "dayjs";
import styles from "./Prices.module.css";

export default function Prices({ prices = [] }) {
  return prices.map(({ price, simulated, date }) => (
    <li key={date} className={styles.price}>
      <p>{simulated ? "🟡" : "🟢"}</p>
      <div className={styles.data}>
        <p>{price / 100000}€ </p>
        <p>{dayjs(date).format("dd HH:mm")}</p>
      </div>
    </li>
  ));
}
