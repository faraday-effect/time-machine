import groupBy from "lodash/groupBy";

import { hoursMinutes, minutesBetween } from "@/helpers/time-and-date";

export class Account {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;

  constructor(account: Account) {
    this.id = account.id;
    this.firstName = account.firstName;
    this.lastName = account.lastName;
    this.email = account.email;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class Project {
  readonly id: number;
  readonly title: string;

  constructor(project: Project) {
    this.id = project.id;
    this.title = project.title;
  }
}

interface EntryFields {
  id: number;
  start: string;
  stop: string;
  description: string;
  created: Date;
  updated: Date;
  account?: Account;
  project?: Project;
}

export class Entry {
  readonly id: number;
  readonly start: string;
  readonly stop: string;
  readonly description: string;
  readonly created: Date;
  readonly updated: Date;
  readonly account?: Account;
  readonly project?: Project;

  constructor(entry: EntryFields) {
    this.id = entry.id;
    this.start = entry.start;
    this.stop = entry.stop;
    this.description = entry.description;
    this.created = entry.created;
    this.updated = entry.updated;
    if (entry.account) {
      this.account = new Account(entry.account);
    }
    if (entry.project) {
      this.project = new Project(entry.project);
    }
  }

  get minutes() {
    return minutesBetween(this.start, this.stop);
  }

  get duration() {
    return hoursMinutes(this.minutes);
  }
}

function totalMinutes(entries: Entry[]) {
  return entries.reduce((acc, val) => acc + val.minutes, 0);
}

export class Entries {
  readonly entries: Entry[];

  constructor(entries: EntryFields[]) {
    this.entries = entries.map(entry => new Entry(entry));
  }

  get minutes() {
    return totalMinutes(this.entries);
  }

  get duration() {
    return hoursMinutes(this.minutes);
  }

  private byGroups(iteratee: string) {
    const groups = groupBy(this.entries, iteratee);
    return Object.entries(groups).map(function([key, val]) {
      const minutes = totalMinutes(val);
      return {
        groupName: key,
        entries: val,
        minutes,
        duration: hoursMinutes(minutes)
      };
    });
  }

  get byProject() {
    return this.byGroups("project.title");
  }

  get byAccount() {
    return this.byGroups("account.fullName");
  }
}
