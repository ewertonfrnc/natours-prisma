import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ToursModule } from './tours/tours.module';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ToursModule,
    UsersModule,
    DatabaseModule,
    AuthModule,
    ReviewsModule,
  ],
})
export class AppModule {}
