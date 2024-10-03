import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { ToursService } from './tours.service';
import { TourQueries } from './entities/tour.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { Role } from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { ReviewsService } from '../reviews/reviews.service';
import { CreateReviewDto } from '../reviews/dto/create-review.dto';
import { User as ReqUser } from '../utils/decorators/user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { UpdateReviewDto } from '../reviews/dto/update-review.dto';

@Controller('tours')
export class ToursController {
  constructor(
    private readonly toursService: ToursService,
    private reviewService: ReviewsService,
  ) {}

  @Roles(Role.Admin, Role.LeadGuide)
  @Post()
  create(@Body() createTourDto: CreateTourDto) {
    return this.toursService.create(createTourDto);
  }

  @Public()
  @Get()
  findAll(@Query() query: TourQueries) {
    return this.toursService.findAll(query);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toursService.findOne(id);
  }

  @Roles(Role.Admin, Role.LeadGuide)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTourDto: UpdateTourDto) {
    return this.toursService.update(id, updateTourDto);
  }

  @Roles(Role.Admin, Role.LeadGuide)
  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.toursService.remove(id);
  }

  @Roles(Role.User, Role.Admin)
  @Post(':tourId/reviews')
  createTourReview(
    @Param('tourId') tourId: string,
    @ReqUser() user: User,
    @Body() dto: CreateReviewDto,
  ) {
    if (!dto.tourId) dto.tourId = +tourId;
    if (!dto.userId) dto.userId = user.id;

    return this.reviewService.create(dto);
  }

  @Roles(Role.User, Role.Admin)
  @Patch('/:tourId/reviews/:reviewId')
  updateTourReview(
    @Param('tourId') tourId: string,
    @Param('reviewId') reviewId: string,
    @ReqUser() user: User,
    @Body() dto: UpdateReviewDto,
  ) {
    if (!dto.tourId) dto.tourId = +tourId;
    if (!dto.userId) dto.userId = user.id;

    return this.reviewService.update(reviewId, dto);
  }

  @Roles(Role.User, Role.Admin)
  @Delete('/:tourId/reviews/:reviewId')
  deleteTourReview(
    @Param('tourId') tourId: number,
    @Param('reviewId') reviewId: string,
  ) {
    return this.reviewService.remove(reviewId, +tourId);
  }

  @Get(':tourId/reviews')
  findAllTourReviews(@Param('tourId') tourId: string) {
    return this.reviewService.findTourReviews(Number(tourId));
  }
}
