import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointment/appointment.entity';
import { AppointmentStatusEnum } from 'src/shared';
import { Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create.dto';
import { Review } from './review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createReview(createReviewDto: CreateReviewDto) {
    const { appointmentId } = createReviewDto;
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id: appointmentId,
      },
    });
    if (!appointment) {
      throw new NotFoundException('Appoinment not found');
    }
    if (appointment.reviewId) {
      throw new BadRequestException('This appointment has a review');
    }
    if (appointment.status !== AppointmentStatusEnum.FINISHED) {
      throw new BadRequestException('This appointment has not been finished');
    }
    const createdReview = this.reviewRepository.create({
      appointment,
      ...createReviewDto,
    });
    const review = await this.reviewRepository.save(createdReview);
    await this.appointmentRepository.update({ id: appointmentId }, { review });
    return review;
  }

  async getReviews(doctorId: string) {
    const reviews = await this.reviewRepository.find({
      relations: ['appointment', 'appointment.client'],
      where: { appointment: { doctorId } },
    });
    return reviews.map((review) => {
      return {
        id: review.id,
        rating: review.rating,
        feedback: review.feedback,
        createdAt: review.createdAt,
        client: review.appointment.client,
      };
    });
  }
}
