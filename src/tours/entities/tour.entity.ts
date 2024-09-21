import { Tour } from '@prisma/client';

export interface TourQueries extends Tour {
  page: string;
  sort: string;
  limit: string;
  fields: string;
}
