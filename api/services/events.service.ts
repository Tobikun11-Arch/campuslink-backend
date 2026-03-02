import {eventRepository} from '../repositories/event.repository';
import {ApiError} from '../utils/errors';
import {updateBadgeProgress} from '../utils/badgeUpdater';

export const eventsService = {
  async list(query: {
    campus?: string;
    type?: string;
    dateFrom?: string;
    dateTo?: string;
    limit?: string;
    page?: string;
  }) {
    const filter: any = {};
    if (query.campus) {
      filter.campus = query.campus;
    }
    if (query.type) {
      filter.type = query.type;
    }

    if (query.dateFrom || query.dateTo) {
      filter.dateTime = {};
      if (query.dateFrom) {
        filter.dateTime.$gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        filter.dateTime.$lte = new Date(query.dateTo);
      }
    }

    const limit = Number(query.limit ?? 20);
    const page = Number(query.page ?? 1);
    const skip = (page - 1) * limit;

    return eventRepository.list(filter, {limit, skip, sort: {dateTime: 1}});
  },

  async create(data: any) {
    return eventRepository.create(data);
  },

  async rsvp(eventId: string, userId: string) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    const alreadyJoined = (event.participants ?? []).some(
      p => String(p) === userId
    );
    if (alreadyJoined) {
      return;
    }

    if (event.capacity && event.attendingCount >= event.capacity) {
      throw new ApiError(400, 'EVENT_FULL', 'Event is full');
    }

    const result = await eventRepository.addParticipant(eventId, userId);
    if (result.matchedCount === 0) {
      return;
    }

    await updateBadgeProgress(userId, 'EVENT_PARTICIPATION', eventId);
  },

  async unrsvp(eventId: string, userId: string) {
    const event = await eventRepository.findById(eventId);
    if (!event) {
      throw new ApiError(404, 'EVENT_NOT_FOUND', 'Event not found');
    }

    await eventRepository.removeParticipant(eventId, userId);
  }
};
