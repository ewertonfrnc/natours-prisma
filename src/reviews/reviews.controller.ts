import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Public } from '../auth/decorators/public.decorator';
import { Review, User } from '@prisma/client';
import { User as ReqUser } from '../utils/decorators/user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Roles(Role.User, Role.Admin)
  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Public()
  @Post('batch')
  createBatch(@Body() batch: Review[]) {
    return this.reviewsService.createBatch(batch);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(+id);
  }

  @Roles(Role.User, Role.Admin)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @ReqUser() user: User,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    if (!updateReviewDto.userId) updateReviewDto.userId = user.id;

    return this.reviewsService.update(id, updateReviewDto);
  }
}
