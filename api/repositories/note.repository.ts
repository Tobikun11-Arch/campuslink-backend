import { NoteModel } from '../models/Note.model';

export const noteRepository = {
  create: (data: any) => NoteModel.create(data),
  list: (filter: any, options: { limit: number; skip: number; sort: any }) =>
    NoteModel.find(filter).sort(options.sort).skip(options.skip).limit(options.limit).exec()
};
