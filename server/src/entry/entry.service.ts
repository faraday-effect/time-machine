import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Entry, EntryCreateInput } from "./entities";
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

  deleteEntry(id: number) {
    return this.entryRepo.delete(id).then(result => result.affected);
  }
}
