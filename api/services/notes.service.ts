import {noteRepository} from '../repositories/note.repository';
import {uploadToAppwrite} from './appwrite.service';
import {validateFile} from '../utils/fileValidation';
import {ApiError} from '../utils/errors';

const allowedTypes = ['application/pdf'];
const allowedExtensions = ['.pdf'];

export const notesService = {
  async list(query: {limit?: string; page?: string}) {
    const limit = Number(query.limit ?? 20);
    const page = Number(query.page ?? 1);
    const skip = (page - 1) * limit;

    return noteRepository.list({}, {limit, skip, sort: {createdAt: -1}});
  },

  async create(data: {
    title: string;
    description: string;
    campus: string;
    authorId: string;
    file: Express.Multer.File;
  }) {
    validateFile(data.file, allowedTypes, 10 * 1024 * 1024, allowedExtensions);
    const upload = await uploadToAppwrite(data.file);

    return noteRepository.create({
      title: data.title,
      description: data.description,
      campus: data.campus,
      authorId: data.authorId,
      fileId: upload.fileId,
      fileUrl: upload.fileUrl
    });
  },

  async approve(noteId: string) {
    const note = await noteRepository.findById(noteId);
    if (!note) {
      throw new ApiError(404, 'NOTE_NOT_FOUND', 'Note not found');
    }

    await noteRepository.updateStatus(noteId, 'APPROVED');
  },

  async reject(noteId: string, reason?: string) {
    const note = await noteRepository.findById(noteId);
    if (!note) {
      throw new ApiError(404, 'NOTE_NOT_FOUND', 'Note not found');
    }

    await noteRepository.updateStatus(noteId, 'REJECTED', reason);
  },

  async trackView(noteId: string) {
    const note = await noteRepository.findById(noteId);
    if (!note) {
      throw new ApiError(404, 'NOTE_NOT_FOUND', 'Note not found');
    }

    await noteRepository.incrementViews(noteId);
  },

  async trackDownload(noteId: string) {
    const note = await noteRepository.findById(noteId);
    if (!note) {
      throw new ApiError(404, 'NOTE_NOT_FOUND', 'Note not found');
    }

    await noteRepository.incrementDownloads(noteId);
  }
};
