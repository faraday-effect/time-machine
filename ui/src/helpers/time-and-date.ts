import { DateTime, Duration } from "luxon";

type DurationUnit = "years" | "months" | "days" | "hours" | "minutes";

export function durationAs(minutes: number, ...units: DurationUnit[]) {
  const shifted = Duration.fromObject({ minutes }).shiftTo(...units);
  const segments = units
    .filter(unit => shifted[unit] > 0)
    .map(unit => `${shifted[unit]}${unit[0]}`);
  return segments.join(" ");
}

export function yearsDaysHoursMinutes(minutes: number) {
  return durationAs(minutes, "years", "days", "hours", "minutes");
}

export function hoursMinutes(minutes: number) {
  return durationAs(minutes, "hours", "minutes");
}

export function now() {
  return DateTime.local();
}

export function formatDate(dt: DateTime = now()) {
  return dt.toFormat("yyyy-MM-dd");
}

export function formatTime(dt: DateTime = now()) {
  return dt.toFormat("HH:mm");
}

export function nowDateTime() {
  const dt = now();
  return `${formatDate(dt)}T${formatTime(dt)}`;
}

function dateTimeToDateObject(dt: string) {
  const { year, month, day } = DateTime.fromISO(dt).toObject();
  return DateTime.fromObject({ year, month, day });
}

export function dayDelta(startDateTime: string, stopDateTime: string) {
  const start = dateTimeToDateObject(startDateTime);
  const stop = dateTimeToDateObject(stopDateTime);
  return stop.diff(start, "days").days;
}

export function minutesBetween(startDateTime: string, stopDateTime: string) {
  const start = DateTime.fromISO(startDateTime);
  const end = DateTime.fromISO(stopDateTime);
  return end.diff(start).as("minutes");
}

const FANCY_DATE_FORMAT = "ccc/dd-LLL-yyyy";
const FANCY_TIME_FORMAT = "hh:mm a";

export function fancyDate(dt: string) {
  return DateTime.fromISO(dt).toFormat(FANCY_DATE_FORMAT);
}

export function fancyTime(dt: string) {
  return DateTime.fromISO(dt).toFormat(FANCY_TIME_FORMAT);
}
