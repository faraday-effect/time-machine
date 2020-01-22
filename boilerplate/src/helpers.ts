import invariant from "invariant";
import pluralize from "pluralize";

export function lowerFirst(s: string) {
  invariant(s.length > 0, "string is empty");
  return s.replace(/^\w/, c => c.toLowerCase());
}

export class InflectionTable {
  entityUpper: string;
  entityLower: string;
  entityUpperPlural: string;
  entityLowerPlural: string;
  entityAllUpper: string;
  entityAllUpperPlural: string;

  constructor(name: string) {
    invariant(/^[A-Z][A-Za-z]*$/.test(name), `invalid name '${name}'`);

    this.entityUpper = name;
    this.entityLower = lowerFirst(this.entityUpper);
    this.entityUpperPlural = pluralize(this.entityUpper);
    this.entityLowerPlural = pluralize(this.entityLower);
    this.entityAllUpper = this.entityLower.toUpperCase();
    this.entityAllUpperPlural = this.entityLowerPlural.toUpperCase();
  }
}
