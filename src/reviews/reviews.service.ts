import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { DatabaseService } from '../database/database.service';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private db: DatabaseService) {}

  async calcAverageRatings(tourId: number) {
    const stats = await this.db.review.aggregate({
      where: { tourId: tourId },
      _count: { review: true },
      _avg: { rating: true },
    });

    await this.db.tour.update({
      where: { id: tourId },
      data: {
        ratingsQuantity: stats._count.review,
        ratingsAverage: stats._avg.rating,
      },
    });
    console.log('calcAverageRatings', { stats });
  }

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

      await this.calcAverageRatings(createReviewDto.tourId);

      return { status: 'success', review };
    } catch (e) {
      return { status: 'fail', error: e };
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

  async findOne(id: number) {
    return 'this action find one review';
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    try {
      const review = await this.db.review.update({
        where: { id },
        data: updateReviewDto,
      });

      await this.calcAverageRatings(updateReviewDto.tourId);

      return { status: 'success', review };
    } catch (e) {
      return { status: 'fail', error: e };
    }
  }

  async remove(reviewId: string, tourId: number) {
    try {
      await this.db.review.delete({ where: { id: reviewId } });
      await this.calcAverageRatings(tourId);

      return { status: 'success' };
    } catch (e) {
      return { status: 'fail', error: e };
    }
  }

  async findTourReviews(tourId: number) {
    try {
      const reviews = await this.db.review.findMany({
        where: { tourId },
        include: { User: { select: { name: true } } },
      });

      return { status: 'success', results: reviews.length, reviews };
    } catch (e) {
      return { status: 'failed', error: e };
    }
  }

  async createBatch(batch: Review[]) {
    try {
      const reviews = await this.db.review.createManyAndReturn({
        data: batch,
        skipDuplicates: true,
      });

      return { status: 'success', results: reviews.length, reviews };
    } catch (e) {
      return { status: 'failed', error: e };
    }
  }
}
