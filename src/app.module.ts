import { Module } from '@nestjs/common';
import { ToursModule } from './tours/tours.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ToursModule, UsersModule],
})
export class AppModule {}
