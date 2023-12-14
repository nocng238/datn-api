import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateReviewDto } from './dto/create.dto';
import { ReviewService } from './review.service';
import { GetUser } from 'src/auth/user-decorator';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';

@Controller('review')
@UseGuards(JwtAuthGuard)
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.createReview(createReviewDto);
  }
  @Get()
  async getReviews(@GetUser() user: Client | Doctor) {
    if (!user.isDoctor) {
      throw new ForbiddenException('Not allow client');
    }
    return this.reviewService.getReview(user as Doctor);
  }
}
