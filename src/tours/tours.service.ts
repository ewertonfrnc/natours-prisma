import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourQueries } from './entities/tour.entity';
import { getFields } from '../utils/api-features.utils';

@Injectable()
export class ToursService {
  constructor(private db: DatabaseService) {}

  async create(createTourDto: CreateTourDto) {
    try {
      const newTour = await this.db.tour.create({ data: createTourDto });
      return { status: 'success', data: newTour };
    } catch (e) {
      return { status: 'fail', error: e };
    }
  }

  async findAll(query: TourQueries) {
    try {
      const queryObj = { ...query };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach((field) => delete queryObj[field]);

      const sortBy = query.sort
        ? query.sort.split(',').map((sortField) => {
            const isDescending = sortField.startsWith('-');
            const field = isDescending ? sortField.slice(1) : sortField;
            return { [field]: isDescending ? 'desc' : 'asc' };
          })
        : [{ createdAt: 'desc' }];

      const fields = query.fields ? getFields(query.fields.split(',')) : null;

      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 100;
      const skip = (page - 1) * limit;

      const tours = await this.db.tour.findMany({
        orderBy: sortBy,
        select: fields,
        skip,
        take: limit,
      });

      return {
        status: 'success',
        results: tours.length,
        data: tours,
      };
    } catch (e) {
      return { status: 'fail', error: e };
    }
  }

  async findOne(id: string) {
    try {
      const tour = await this.db.tour.findUnique({ where: { uId: id } });
      return { status: 'success', data: tour };
    } catch (e) {
      return { status: 'fail', error: e };
    }
  }

  async update(uId: string, updateTourDto: UpdateTourDto) {
    try {
      const updateTour = await this.db.tour.update({
        where: { uId },
        data: updateTourDto,
      });

      return { status: 'success', data: updateTour };
    } catch (e) {
      return { status: 'fail', error: e };
    }
  }

  remove(id: string) {
    return `This action removes a #${id} tour`;
  }
}
