import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Entry, EntryCreateInput, EntryUpdateInput } from "./entities";
import { Repository } from "typeorm";
import { Account } from "@/account/entities";
import debug from "debug";

const entryDebug = debug("event");

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(Entry) private readonly entryRepo: Repository<Entry>,
    @InjectRepository(Account) private readonly accountRepo: Repository<Account>
  ) {}

  async createEntry(createInput: EntryCreateInput) {
    entryDebug("createInput %O", createInput);

    const account = await this.accountRepo.findOneOrFail(createInput.accountId);
    const entry = this.entryRepo.create(createInput);
    entry.account = account;
    return this.entryRepo.save(entry);
  }

  readEntries() {
    return this.entryRepo.find({ relations: ["account"] });
  }

  readEntriesForAccount(accountId: number) {
    return this.entryRepo
      .createQueryBuilder("entry")
      .innerJoinAndSelect("entry.account", "account")
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
