import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Client } from 'src/client/client.entity';
import { Doctor } from 'src/doctor/doctor.entity';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): Client | Doctor => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
