import { MarketplaceModel } from '../models/Marketplace.model';

export const marketplaceRepository = {
  create: (data: any) => MarketplaceModel.create(data),
  list: (filter: any, options: { limit: number; skip: number; sort: any }) =>
    MarketplaceModel.find(filter).sort(options.sort).skip(options.skip).limit(options.limit).exec()
};
