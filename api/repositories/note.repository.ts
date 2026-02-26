import { NoteModel } from '../models/Note.model';

export const noteRepository = {
  create: (data: any) => NoteModel.create(data),
  findById: (id: string) => NoteModel.findById(id).exec(),
  list: (filter: any, options: { limit: number; skip: number; sort: any }) =>
    NoteModel.find(filter).sort(options.sort).skip(options.skip).limit(options.limit).exec(),
  updateStatus: (id: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) =>
    NoteModel.updateOne({_id: id}, {status, rejectionReason}).exec()
};
