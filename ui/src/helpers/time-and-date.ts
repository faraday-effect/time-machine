import { DateTime, Duration } from "luxon";

export function yearsDaysHoursMinutes(minutes: number): string {
  const duration = Duration.fromObject({ minutes });
  const units = duration.shiftTo("years", "days", "hours", "minutes");

  const strings = [`${units.minutes}m`];
  if (units.hours) {
    strings.unshift(`${units.hours}h`);
  }
  if (units.days) {
    strings.unshift(`${units.days}d`);
  }
  if (units.years) {
    strings.unshift(`${units.years}y`);
  }

  return strings.join(" ");
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

export function fancyDateTime(dt: string) {
  return DateTime.fromISO(dt).toFormat(
    `${FANCY_DATE_FORMAT} ${FANCY_TIME_FORMAT}`
  );
}

export function fancyDate(dt: string) {
  return DateTime.fromISO(dt).toFormat(FANCY_DATE_FORMAT);
}

export function fancyTime(dt: string) {
  return DateTime.fromISO(dt).toFormat(FANCY_TIME_FORMAT);
}

export function sameDate(dt1: string, dt2: string) {
  const startObj = DateTime.fromISO(dt1).toObject();
  const stopObj = DateTime.fromISO(dt2).toObject();
  return (
    startObj.year === stopObj.year &&
    startObj.month === stopObj.month &&
    startObj.day === stopObj.day
  );
}
