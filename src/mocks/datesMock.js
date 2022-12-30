import dayjs from "dayjs";

export function today(hours) {
  return dayjs().startOf("day").add(hours, "hours").unix();
}

export function tomorrow(hours) {
  return dayjs().startOf("day").add(1, "day").add(hours, "hours").unix();
}
