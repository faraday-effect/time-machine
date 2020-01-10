import { Duration } from "luxon";

export function hoursMinutes(minutes: number): string {
  const duration = Duration.fromObject({ minutes });
  const units = duration.shiftTo("hours", "minutes");

  const strings = [`${units.minutes}m`];
  if (units.hours > 0) {
    strings.unshift(`${units.hours}h`);
  }
  return strings.join(" ");
}
