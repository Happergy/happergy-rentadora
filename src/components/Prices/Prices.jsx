import dayjs from "dayjs";
import styles from "./Prices.module.css";

/**
 * @typedef {Object} PriceProps
 * @property {number} price
 * @property {boolean} simulated
 * @property {string} date
 *
 * @param {PricesProps[]} param0
 * @returns {JSX.Element}
 */
export default function Prices({ prices = [] }) {
  return prices.map(({ price, simulated, date }) => {
    const day = dayjs(date);
    return (
      <li key={`${day.format()}-${price}`} className={styles.price}>
        <p>{simulated ? "🟡" : "🟢"}</p>
        <div className={styles.data}>
          <p>{parseFloat(price / 100000, 2)}€ </p>
          <p>{day.format("dd HH:mm")}</p>
        </div>
      </li>
    );
  });
}
