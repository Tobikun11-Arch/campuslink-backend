import { MarketplaceModel } from '../models/Marketplace.model';

export const marketplaceRepository = {
  create: (data: any) => MarketplaceModel.create(data),
  findById: (id: string) => MarketplaceModel.findById(id).exec(),
  list: (filter: any, options: { limit: number; skip: number; sort: any }) =>
    MarketplaceModel.find(filter).sort(options.sort).skip(options.skip).limit(options.limit).exec(),
  addReport: (id: string, reportId: string) =>
    MarketplaceModel.updateOne(
      { _id: id },
      { $addToSet: { reports: reportId }, $set: { status: 'REPORTED' } }
    ).exec()
};
