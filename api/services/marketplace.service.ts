import { marketplaceRepository } from '../repositories/marketplace.repository';
import { uploadToAppwrite } from './appwrite.service';
import { validateFile } from '../utils/fileValidation';

const allowedTypes = ['image/jpeg', 'image/png'];
const allowedExtensions = ['.jpg', '.jpeg', '.png'];

export const marketplaceService = {
  async list(query: { limit?: string; page?: string }) {
    const limit = Number(query.limit ?? 20);
    const page = Number(query.page ?? 1);
    const skip = (page - 1) * limit;

    return marketplaceRepository.list({}, { limit, skip, sort: { createdAt: -1 } });
  },

  async create(data: {
    itemTitle: string;
    description: string;
    price?: number;
    sellerId: string;
    files: Express.Multer.File[];
  }) {
    for (const file of data.files) {
      validateFile(file, allowedTypes, 5 * 1024 * 1024, allowedExtensions);
    }

    const uploads = await Promise.all(data.files.map((file) => uploadToAppwrite(file)));

    return marketplaceRepository.create({
      itemTitle: data.itemTitle,
      description: data.description,
      price: data.price,
      sellerId: data.sellerId,
      imageFileIds: uploads.map((u) => u.fileId),
      imageUrls: uploads.map((u) => u.fileUrl),
      campusZoneReminder: 'Please transact within campus zones only.'
    });
  }
};
