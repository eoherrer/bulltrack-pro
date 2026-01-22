import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CurrentUserPayload } from '../interfaces/current-user.interface';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): CurrentUserPayload => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
