import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Entry, EntryCreateInput, EntryUpdateInput } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(Entry) private readonly entryRepo: Repository<Entry>
  ) {}

  createEntry(createInput: EntryCreateInput) {
    return this.entryRepo.save(this.entryRepo.create(createInput));
  }

  readEntries() {
    return this.entryRepo.find();
  }

  readEntriesForAccount(accountId: number) {
    return this.entryRepo
      .createQueryBuilder("entry")
      .innerJoin("entry.account", "account")
      .where("account.id = :id", { id: accountId })
      .getMany();
  }

  updateEntry(updateInput: EntryUpdateInput) {
    return this.entryRepo
      .preload(updateInput)
      .then(result => this.entryRepo.save(result));
  }

  deleteEntry(id: number) {
    return this.entryRepo.delete(id).then(result => result.affected);
  }
}
