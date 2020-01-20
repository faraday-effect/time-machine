export interface EntryStartStop {
  valid: boolean;
  startDateTime: string;
  stopDateTime: string;
  minutes: number;
}

export interface Entry {
  startStop: EntryStartStop;
  projectId: number;
  description: string;
}

export const MAX_MINUTES = 16 * 60;
