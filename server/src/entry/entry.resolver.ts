import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { EntryService } from "./entry.service";
import { Entry, EntryCreateInput } from "./entities";
import { Int } from "type-graphql";

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

  @Mutation(() => Int)
  deleteEntry(@Args({ name: "id", type: () => Int }) id: number) {
    return this.entryService.deleteEntry(id);
  }
}
