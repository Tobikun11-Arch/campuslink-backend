import { LostFoundModel } from '../models/LostFound.model';
import { uploadToAppwrite } from './appwrite.service';
import { validateFile } from '../utils/fileValidation';
import { userRepository } from '../repositories/user.repository';
import { ApiError } from '../utils/errors';

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
    const finder = await userRepository.findById(data.finderId);
    if (!finder) {
      throw new ApiError(404, 'USER_NOT_FOUND', 'User not found');
    }

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
      campus: finder.campus,
      finderId: data.finderId,
      photoFileId: fileId,
      photoUrl: fileUrl,
      expiryDate
    });
  },

  async list(query: { status?: string; campus?: string; limit?: string; page?: string }) {
    const limit = Number(query.limit ?? 20);
    const page = Number(query.page ?? 1);
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (query.status) {
      filter.status = query.status;
    }
    if (query.campus) {
      filter.campus = query.campus;
    }

    return LostFoundModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec();
  },

  async getById(id: string) {
    const doc = await LostFoundModel.findById(id)
      .populate('finderId', 'firstName lastName campus')
      .exec();
    if (!doc) {
      throw new ApiError(404, 'LOSTFOUND_NOT_FOUND', 'Lost and found post not found');
    }

    const finder = doc.finderId as unknown as { _id: string; firstName: string; lastName: string; campus: string };

    return {
      _id: String(doc._id),
      itemTitle: doc.itemTitle,
      description: doc.description,
      location: doc.location,
      status: doc.status,
      photoUrl: doc.photoUrl,
      datePosted: doc.datePosted,
      expiryDate: doc.expiryDate,
      finderProfile: {
        id: String(finder._id),
        name: `${finder.firstName} ${finder.lastName}`,
        campus: finder.campus
      }
    };
  },

  async markRetrieved(id: string, retrievedBy: string) {
    const doc = await LostFoundModel.findById(id).exec();
    if (!doc) {
      throw new ApiError(404, 'LOSTFOUND_NOT_FOUND', 'Lost and found post not found');
    }
    if (doc.status === 'RETRIEVED') {
      throw new ApiError(400, 'ALREADY_RETRIEVED', 'Item already marked as retrieved');
    }

    await LostFoundModel.updateOne(
      { _id: id },
      { status: 'RETRIEVED', retrievedBy }
    ).exec();
  }
};
