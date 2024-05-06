// import { INestApplication } from '@nestjs/common';
// import AdminJS, { ResourceWithOptions } from 'adminjs';
// import { Database, Resource } from '@adminjs/typeorm';
// import { Appointment } from './appointment/appointment.entity';
// import { Client } from './client/client.entity';
// import { ClientCreditCard } from './credit-card/client-credit-card.entity';
// import { DoctorCreditCard } from './credit-card/doctor-credit-card.entity';
// import { DoctorAvailableTime } from './doctor-available-time/doctor-available-time.entity';
// import { Doctor } from './doctor/doctor.entity';
// import { Favorite } from './favorite/favorite.entity';
// import { Review } from './review/review.entity';
//
// export async function setupAdminPanel(app: INestApplication): Promise<void> {
//   AdminJS.registerAdapter({ Database, Resource });
//
//   const AppointmentResource: ResourceWithOptions = {
//     resource: Appointment,
//     options: {
//       // properties: {
//       //   airBrandId: { isVisible: { show: true, filter: true, edit: false } },
//       // },
//       listProperties: [
//         'id',
//         'status',
//         'startTime',
//         'endTime',
//         'doctor',
//         'doctor.name',
//         'clientId',
//         'paymentStatus',
//         'paymentMethod',
//       ],
//       actions: {},
//     },
//   };
//
//   const adminBro = new AdminJS({
//     resources: [
//       AppointmentResource,
//       Doctor,
//       Client,
//       DoctorAvailableTime,
//       Favorite,
//       Review,
//       ClientCreditCard,
//       DoctorCreditCard,
//     ],
//     rootPath: '/admin',
//   });
//
//   const router = AdminJS.buildRouter(adminBro);
//
//   app.use(adminBro.options.rootPath, router);
// }
