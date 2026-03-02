import {NoteModel} from '../models/Note.model';

export const noteRepository = {
  create: (data: any) => NoteModel.create(data),
  findById: (id: string) => NoteModel.findById(id).exec(),
  list: (filter: any, options: {limit: number; skip: number; sort: any}) =>
    NoteModel.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .exec(),
  updateStatus: (
    id: string,
    status: 'APPROVED' | 'REJECTED',
    rejectionReason?: string
  ) => NoteModel.updateOne({_id: id}, {status, rejectionReason}).exec(),
  incrementViews: (id: string) =>
    NoteModel.updateOne({_id: id}, {$inc: {views: 1}}).exec(),
  incrementDownloads: (id: string) =>
    NoteModel.updateOne({_id: id}, {$inc: {downloads: 1}}).exec()
};
