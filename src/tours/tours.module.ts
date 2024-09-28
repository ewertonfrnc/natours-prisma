import { Module } from '@nestjs/common';
import { ToursService } from './tours.service';
import { ToursController } from './tours.controller';
import { ReviewsService } from '../reviews/reviews.service';

@Module({
  controllers: [ToursController],
  providers: [ToursService, ReviewsService],
})
export class ToursModule {}
