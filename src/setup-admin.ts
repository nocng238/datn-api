import { INestApplication } from '@nestjs/common';
import AdminBro from 'admin-bro';
import * as AdminBroExpress from 'admin-bro-expressjs';
import { Database, Resource } from 'admin-bro-typeorm';
import { Appointment } from './appointment/appointment.entity';
import { Client } from './client/client.entity';
import { ClientCreditCard } from './credit-card/client-credit-card.entity';
import { DoctorCreditCard } from './credit-card/doctor-credit-card.entity';
import { DoctorAvailableTime } from './doctor-available-time/doctor-available-time.entity';
import { Doctor } from './doctor/doctor.entity';
import { Favorite } from './favorite/favorite.entity';
import { Review } from './review/review.entity';

export async function setupAdminPanel(app: INestApplication): Promise<void> {
  AdminBro.registerAdapter({ Database, Resource });
  /** Create adminBro instance */
  const adminBro = new AdminBro({
    resources: [
      Appointment,
      Doctor,
      Client,
      DoctorAvailableTime,
      Favorite,
      Review,
      ClientCreditCard,
      DoctorCreditCard,
    ], // Here we will put resources
    rootPath: '/admin', // Define path for the admin panel
  });

  /** Create router */
  const router = AdminBroExpress.buildRouter(adminBro);

  /** Bind routing */
  app.use(adminBro.options.rootPath, router);
}
