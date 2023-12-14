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
import { Doctor } from 'src/doctor/doctor.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
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

  async getReview(doctor: Doctor) {
    const { id } = doctor;
    const queryBuilder = this.reviewRepository
      .createQueryBuilder('review')
      .leftJoinAndSelect('appointment', 'ap', 'review.appointment_id = ap.id')
      .leftJoinAndSelect('doctor', 'doctor', 'ap.doctor_id = doctor.id')
      // .leftJoinAndSelect('client', 'client', 'ap.client_id = client.id')
      .where('doctor.id = :id', { id });

    // const queryBuilder = this.doctorRepository
    //   .createQueryBuilder('doctor')
    //   .leftJoin('doctor.appointments', 'appointments')
    //   .innerJoinAndSelect('appointments.review', 'review')
    //   .where('doctor.id = :id', { id });
    const res = await queryBuilder.getMany();
    console.log(res);

    return res;
  }
}
