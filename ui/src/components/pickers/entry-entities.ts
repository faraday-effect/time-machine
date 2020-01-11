export interface DateAndTime {
  date: string;
  time: string;
}

export interface StartAndStop {
  start: DateAndTime;
  stop: DateAndTime;
  valid: boolean;
  minutes: number;
}

export interface EntryDetails {
  startStop: StartAndStop;
  description: string;
}

