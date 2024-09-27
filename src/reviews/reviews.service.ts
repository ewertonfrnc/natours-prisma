import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReviewsService {
  constructor(private db: DatabaseService) {}

  async create(createReviewDto: CreateReviewDto) {
    try {
      const review = await this.db.review.create({
        data: {
          review: createReviewDto.review,
          rating: createReviewDto.rating,
          userId: createReviewDto.userId,
          tourId: createReviewDto.tourId,
        },
      });

      return { status: 'success', review };
    } catch (e) {
      return { status: 'success', error: e };
    }
  }

  async findAll() {
    try {
      const reviews = await this.db.review.findMany({
        include: {
          User: { select: { name: true, photo: true } },
          Tour: { select: { name: true } },
        },
      });

      return { status: 'success', results: reviews.length, reviews };
    } catch (e) {
      return { status: 'success', error: e };
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
