import { marketplaceRepository } from '../repositories/marketplace.repository';
import { reportRepository } from '../repositories/report.repository';
import { uploadToAppwrite } from './appwrite.service';
import { validateFile } from '../utils/fileValidation';
import { ApiError } from '../utils/errors';

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
  },

  async report(data: { itemId: string; reporterId: string; reason: string }) {
    const item = await marketplaceRepository.findById(data.itemId);
    if (!item) {
      throw new ApiError(404, 'MARKETPLACE_NOT_FOUND', 'Marketplace item not found');
    }

    const report = await reportRepository.create({
      reporterId: data.reporterId,
      targetId: item._id,
      reportedUserId: item.sellerId,
      reason: data.reason
    });

    await marketplaceRepository.addReport(data.itemId, String(report._id));
  }
};
