import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { EntryService } from "./entry.service";
import { Entry, EntryCreateInput } from "./entities";

@Resolver("Entry")
export class EntryResolver {
  constructor(private readonly entryService: EntryService) {}

  @Mutation(() => Entry)
  createEntry(@Args("createInput") createInput: EntryCreateInput) {
    return this.entryService.createEntry(createInput);
  }

  @Query(() => [Entry])
  readEntries() {
    return this.entryService.readEntries();
  }
}
