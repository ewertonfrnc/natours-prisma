import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateTourDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  summary: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  difficulty: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNotEmpty()
  @IsString()
  imageCover: string;

  @IsArray()
  images: string[];

  @IsDate()
  @IsOptional()
  createdAt: Date;

  @IsNumber()
  @IsOptional()
  discountPrice: number;

  @IsNumber()
  @IsOptional()
  ratingsAverage: number;

  @IsNumber()
  @IsOptional()
  ratingsQuantity: number;

  @IsNumber()
  maxGroupSize: number;

  @IsArray()
  startDates: string[];
}
