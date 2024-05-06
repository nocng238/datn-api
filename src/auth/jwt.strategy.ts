import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt.payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Client)
    private clientRepository: Repository<Client>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
    private configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<Client | Doctor> {
    const { id, email } = payload;
    let user: Client | Doctor = null;
    const client = await this.clientRepository.findOneBy({ id, email });
    const doctor = await this.doctorRepository.findOneBy({ id, email });
    if (client) {
      user = client;
    } else if (doctor) {
      user = doctor;
    } else {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
