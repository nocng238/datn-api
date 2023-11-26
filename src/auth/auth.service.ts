import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as dayjs from 'dayjs';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { EmailService } from 'src/email/email.service';
import { StatusEnum } from 'src/shared';
import { Repository } from 'typeorm';
import { ClientRegisterDto } from './dto/client-register.dto';
import { Credentials } from './dto/credentials.dto';
import { DoctorRegisterDto } from './dto/doctor-register.dto';
import { VerifyEmailRequestParamDto } from './dto/token-request-param.dto';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async login(credentials: Credentials) {
    let { email } = credentials;
    const { password } = credentials;
    email = email.trim();
    let user: Client | Doctor = null;
    const client = await this.clientRepository.findOneBy({ email });
    const doctor = await this.doctorRepository.findOneBy({ email });
    if (client) {
      user = client;
    } else if (doctor) {
      user = doctor;
    } else {
      throw new UnauthorizedException('User not found');
    }
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Email or password is incorrect');
    }
    if (user.status === StatusEnum.NOT_VERIFY) {
      throw new UnauthorizedException('Email is not verified');
    }
    const payload: JwtPayload = {
      email,
      id: user.id,
      phone: user.phone ? user.phone : null,
      isDoctor: user.isDoctor,
      fullname: user.fullname ? user.fullname : null,
      address: user.address ? user.address : null,
      sex: user.sex ? user.sex : null,
      status: user.status ? user.status : null,
    };
    const accessToken: string = this.jwtService.sign(payload);
    return {
      accessToken,
    };
  }

  async clientRegister(registerDto: ClientRegisterDto): Promise<Client> {
    const salt = await bcrypt.genSalt();
    const { password } = registerDto;
    let { email } = registerDto;
    const hashedPassword = await bcrypt.hash(password, salt);
    email = email.trim();
    let user: Client | Doctor = null;
    const client = await this.clientRepository.findOneBy({ email });
    const doctor = await this.doctorRepository.findOneBy({ email });
    if (client) {
      user = client;
    } else if (doctor) {
      user = doctor;
    }
    if (!user) {
      user = this.clientRepository.create({
        ...registerDto,
        email,
        password: hashedPassword,
      });
    } else if (user.status === StatusEnum.NOT_VERIFY) {
      user = this.clientRepository.create({
        id: user.id,
        ...registerDto,
        email,
        password: hashedPassword,
      });
    } else {
      throw new ConflictException('Email already exists');
    }
    const token = await this.generateToken(email);
    user.registerVerifyingToken = token;
    const verificationUrl = await this.sendVerificationLink(token, email);
    const expiredTime = dayjs(user.sentEmailVerifyAt).add(1, 'm');
    if (!user.sentEmailVerifyAt || dayjs().isAfter(expiredTime)) {
      this.emailService.sendVerifyEmail(user.email, verificationUrl);
      user.sentEmailVerifyAt = new Date();
    }

    return this.clientRepository.save(user);
  }

  async doctorRegister(registerDto: DoctorRegisterDto): Promise<Doctor> {
    const salt = await bcrypt.genSalt();
    const { password } = registerDto;
    let { email } = registerDto;
    const hashedPassword = await bcrypt.hash(password, salt);
    email = email.trim();
    let user: Client | Doctor = null;
    const client = await this.clientRepository.findOneBy({ email });
    const doctor = await this.doctorRepository.findOneBy({ email });
    if (client) {
      user = client;
    } else if (doctor) {
      user = doctor;
    }
    if (!user) {
      user = this.doctorRepository.create({
        ...registerDto,
        email,
        password: hashedPassword,
      });
    } else if (user.status === StatusEnum.NOT_VERIFY) {
      user = this.doctorRepository.create({
        id: user.id,
        ...registerDto,
        email,
        password: hashedPassword,
      });
    } else {
      throw new ConflictException('Email already exists');
    }
    const token = await this.generateToken(email);
    user.registerVerifyingToken = token;
    const verificationUrl = await this.sendVerificationLink(token, email);
    const expiredTime = dayjs(user.sentEmailVerifyAt).add(1, 'm');
    if (!user.sentEmailVerifyAt || dayjs().isAfter(expiredTime)) {
      this.emailService.sendVerifyEmail(user.email, verificationUrl);
      user.sentEmailVerifyAt = new Date();
    }

    return this.doctorRepository.save(user);
  }

  private async generateToken(email: string): Promise<string> {
    const payload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: 3600,
    });
    return token;
  }

  async verifyEmail(
    verifyEmailRequestParamDto: VerifyEmailRequestParamDto,
  ): Promise<{ message: string }> {
    let { email } = verifyEmailRequestParamDto;
    const { token } = verifyEmailRequestParamDto;
    email = email.toLowerCase();
    const user = await this.decodeVerificationToken(token);
    await this.markEmailAsVerify(user);
    return {
      message: 'VERIFY_EMAIL_SUCCESSFULLY',
    };
  }

  private async decodeVerificationToken(
    token: string,
  ): Promise<Client | Doctor> {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });
      const email =
        typeof payload === 'object' && 'email' in payload
          ? payload.email
          : null;
      let user: Client | Doctor = null;
      const client = await this.clientRepository.findOneBy({ email });
      const doctor = await this.doctorRepository.findOneBy({ email });
      if (client) {
        user = client;
      } else if (doctor) {
        user = doctor;
      }
      if (user.registerVerifyingToken !== token) {
        throw new BadRequestException('VERIFICATION_TOKEN_WRONG');
      }
      return user;
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('VERIFICATION_TOKEN_EXPIRED');
      }
      throw new BadRequestException('VERIFICATION_BAD_TOKEN');
    }
  }

  private async markEmailAsVerify(
    user: Client | Doctor,
  ): Promise<Client | Doctor> {
    user.status = StatusEnum.VERIFY;
    if (user.isDoctor) {
      return this.doctorRepository.save(user);
    } else {
      return this.clientRepository.save(user);
    }
  }

  private async sendVerificationLink(
    token: string,
    email: string,
  ): Promise<string> {
    const verificationUrl = `${this.configService.get(
      'WEB_URL',
    )}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;
    return verificationUrl;
  }
}
