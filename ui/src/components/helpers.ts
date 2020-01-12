import { DateTime, Duration } from "luxon";

export function hoursMinutes(minutes: number): string {
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
  return dt.toFormat("hh:mm");
}

export function nowDateTime() {
  const dt = now();
  return `${formatDate(dt)}T${formatTime(dt)}`;
}
