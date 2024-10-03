import { PartialType } from '@nestjs/mapped-types';
import { CreateReviewDto } from './create-review.dto';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto extends PartialType(CreateReviewDto) {
  @IsString()
  @IsOptional()
  review: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsOptional()
  userId: string;

  @IsNumber()
  @IsOptional()
  tourId: number;
}
