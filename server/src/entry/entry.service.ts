import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Entry } from "./entities";
import { Repository } from "typeorm";
import { EntryCreateInput } from "../../dist/entry/entities/entry";

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
}
