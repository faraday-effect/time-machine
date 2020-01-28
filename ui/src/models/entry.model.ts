import {
  AllEntries_allEntries as GqlEntry,
  AllEntries_allEntries_project as GqlProject,
  AllEntries_allEntries_account as GqlAccount
} from "@/graphql/types/AllEntries";

import groupBy from "lodash/groupBy";

import { minutesBetween, yearsDaysHoursMinutes } from "@/helpers/time-and-date";

export class Account implements GqlAccount {
  readonly id: number;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;

  constructor(gqlAccount: GqlAccount) {
    this.id = gqlAccount.id;
    this.firstName = gqlAccount.firstName;
    this.lastName = gqlAccount.lastName;
    this.email = gqlAccount.email;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class Project implements GqlProject {
  readonly id: number;
  readonly title: string;

  constructor(gqlProject: GqlProject) {
    this.id = gqlProject.id;
    this.title = gqlProject.title;
  }
}

export class Entry implements GqlEntry {
  readonly id: number;
  readonly start: string;
  readonly stop: string;
  readonly description: string;
  readonly created: Date;
  readonly updated: Date;
  readonly account: Account;
  readonly project: Project;

  constructor(gqlEntry: GqlEntry) {
    this.id = gqlEntry.id;
    this.start = gqlEntry.start;
    this.stop = gqlEntry.stop;
    this.description = gqlEntry.description;
    this.created = gqlEntry.created;
    this.updated = gqlEntry.updated;
    this.account = new Account(gqlEntry.account);
    this.project = new Project(gqlEntry.project);
  }

  get minutes() {
    return minutesBetween(this.start, this.stop);
  }

  get duration() {
    return yearsDaysHoursMinutes(this.minutes);
  }
}

function totalMinutes(entries: Entry[]) {
  return entries.reduce((acc, val) => acc + val.minutes, 0);
}

export class Entries {
  private readonly entries: Entry[];

  constructor(gqlEntries: GqlEntry[]) {
    this.entries = gqlEntries.map(gqlEntry => new Entry(gqlEntry));
  }

  get minutes() {
    return totalMinutes(this.entries);
  }

  get duration() {
    return yearsDaysHoursMinutes(this.minutes);
  }

  private byGroups(iteratee: string) {
    const groups = groupBy(this.entries, iteratee);
    return Object.entries(groups).map(function([key, val]) {
      const minutes = totalMinutes(val);
      return {
        groupName: key,
        entries: val,
        minutes,
        duration: yearsDaysHoursMinutes(minutes)
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
