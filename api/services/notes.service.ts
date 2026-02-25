import { noteRepository } from '../repositories/note.repository';
import { uploadToAppwrite } from './appwrite.service';
import { validateFile } from '../utils/fileValidation';

const allowedTypes = ['application/pdf'];
const allowedExtensions = ['.pdf'];

export const notesService = {
  async list(query: { limit?: string; page?: string }) {
    const limit = Number(query.limit ?? 20);
    const page = Number(query.page ?? 1);
    const skip = (page - 1) * limit;

    return noteRepository.list({}, { limit, skip, sort: { createdAt: -1 } });
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
  }
};
