import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourQueries } from './entities/tour.entity';

@Injectable()
export class ToursService {
  constructor(private db: DatabaseService) {}

  async create(createTourDto: CreateTourDto) {
    try {
      const newTour = await this.db.tour.create({
        data: {
          ...createTourDto,
          guides: {
            connect: createTourDto.guides.map((guideId) => ({ id: guideId })),
          },
        },
        include: {
          guides: {
            omit: {
              password: true,
              passwordConfirm: true,
              passwordChangedAt: true,
            },
          },
        },
      });

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
        : [{ createdAt: 'asc' }];

      const page = Number(query.page) || 1;
      const limit = Number(query.limit) || 100;
      const skip = (page - 1) * limit;

      const tours = await this.db.tour.findMany({
        skip,
        take: limit,
        orderBy: sortBy,
        // include: { guides: true, reviews: true },
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
    const tour = await this.db.tour.findUnique({
      where: { uId: id },
      include: {
        reviews: {
          include: { User: { select: { id: true, name: true } } },
        },
        guides: true,
      },
    });

    if (!tour) {
      throw new HttpException(
        {
          status: 'fail',
          error: `No tour with the id (${id}) was found.`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return { status: 'success', tour };
  }

  async update(uId: string, updateTourDto: UpdateTourDto) {
    try {
      const updateTour = await this.db.tour.update({
        where: { uId },
        data: { ...updateTourDto, guides: {} },
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
