import { eventRepository } from '../repositories/event.repository';

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

    return eventRepository.list(filter, { limit, skip, sort: { dateTime: 1 } });
  },

  async create(data: any) {
    return eventRepository.create(data);
  }
};
