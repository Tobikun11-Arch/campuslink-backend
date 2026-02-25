import { LostFoundModel } from '../models/LostFound.model';
import { uploadToAppwrite } from './appwrite.service';
import { validateFile } from '../utils/fileValidation';

const allowedTypes = ['image/jpeg', 'image/png'];
const allowedExtensions = ['.jpg', '.jpeg', '.png'];

export const lostFoundService = {
  async create(data: {
    itemTitle: string;
    description: string;
    location: string;
    finderId: string;
    file?: Express.Multer.File;
  }) {
    if (data.file) {
      validateFile(data.file, allowedTypes, 5 * 1024 * 1024, allowedExtensions);
    }

    const expiryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
    let fileId: string | undefined;
    let fileUrl: string | undefined;

    if (data.file) {
      const upload = await uploadToAppwrite(data.file);
      fileId = upload.fileId;
      fileUrl = upload.fileUrl;
    }

    return LostFoundModel.create({
      itemTitle: data.itemTitle,
      description: data.description,
      location: data.location,
      finderId: data.finderId,
      photoFileId: fileId,
      photoUrl: fileUrl,
      expiryDate
    });
  }
};
