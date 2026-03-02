import {EventModel} from '../models/Event.model';

export const eventRepository = {
  create: (data: any) => EventModel.create(data),
  findById: (id: string) => EventModel.findById(id).exec(),
  list: (filter: any, options: {limit: number; skip: number; sort: any}) =>
    EventModel.find(filter)
      .sort(options.sort)
      .skip(options.skip)
      .limit(options.limit)
      .exec(),

  addParticipant: (eventId: string, userId: string) =>
    EventModel.updateOne(
      {_id: eventId, participants: {$ne: userId}},
      {$addToSet: {participants: userId}, $inc: {attendingCount: 1}}
    ).exec(),

  removeParticipant: (eventId: string, userId: string) =>
    EventModel.updateOne(
      {_id: eventId, participants: {$in: [userId]}},
      {$pull: {participants: userId}, $inc: {attendingCount: -1}}
    ).exec()
};
