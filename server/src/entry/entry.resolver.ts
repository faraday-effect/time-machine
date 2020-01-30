import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { EntryService } from "./entry.service";
import { Entry, EntryCreateInput, EntryUpdateInput } from "./entities";
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

  @Query(() => [Entry])
  readEntriesByAccount(
    @Args({ name: "accountId", type: () => Int, nullable: true })
    accountId: number
  ) {
    return this.entryService.readEntriesByAccount(accountId);
  }

  @Query(() => [Entry])
  readEntriesByProject(
    @Args({ name: "projectId", type: () => Int, nullable: true })
    projectId: number
  ) {
    return this.entryService.readEntriesByProject(projectId);
  }

  @Mutation(() => Entry)
  updateEntry(@Args("updateInput") updateInput: EntryUpdateInput) {
    return this.entryService.updateEntry(updateInput);
  }

  @Mutation(() => Int)
  deleteEntry(@Args({ name: "id", type: () => Int }) id: number) {
    return this.entryService.deleteEntry(id);
  }
}
