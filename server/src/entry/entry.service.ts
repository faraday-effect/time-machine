import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Entry, EntryCreateInput, EntryUpdateInput } from "./entities";
import { Repository } from "typeorm";
import { Account } from "@/account/entities";
import debug from "debug";
import { Project } from "@/project/entities";

const entryDebug = debug("event");

@Injectable()
export class EntryService {
  constructor(
    @InjectRepository(Entry)
    private readonly entryRepo: Repository<Entry>,
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>
  ) {}

  async createEntry(createInput: EntryCreateInput) {
    entryDebug("createInput %O", createInput);

    return this.entryRepo
      .save(this.entryRepo.create(createInput))
      .then(savedEntity =>
        this.entryRepo.findOne(savedEntity.id, {
          relations: ["account", "project"]
        })
      );
  }

  readEntries() {
    return this.entryRepo.find({ relations: ["account", "project"] });
  }

  readEntriesByAccount(accountId: number) {
    return this.entryRepo
      .createQueryBuilder("entry")
      .innerJoinAndSelect("entry.account", "account")
      .innerJoinAndSelect("entry.project", "project")
      .where("account.id = :id", { id: accountId })
      .getMany();
  }

  readEntriesByProject(projectId: number) {
    return this.entryRepo
      .createQueryBuilder("entry")
      .innerJoinAndSelect("entry.account", "account")
      .innerJoinAndSelect("entry.project", "project")
      .where("project.id = :id", { id: projectId })
      .getMany();
  }

  async updateEntry(updateInput: EntryUpdateInput) {
    entryDebug("updateInput %O", updateInput);

    return this.entryRepo
      .preload(updateInput)
      .then(updatedInput => this.entryRepo.save(updatedInput))
      .then(savedInput =>
        this.entryRepo.findOne(savedInput.id, {
          relations: ["account", "project"]
        })
      );
  }

  deleteEntry(id: number) {
    return this.entryRepo.delete(id).then(result => result.affected);
  }
}
