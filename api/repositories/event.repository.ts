import { EventModel } from '../models/Event.model';

export const eventRepository = {
  create: (data: any) => EventModel.create(data),
  list: (filter: any, options: { limit: number; skip: number; sort: any }) =>
    EventModel.find(filter).sort(options.sort).skip(options.skip).limit(options.limit).exec()
};
