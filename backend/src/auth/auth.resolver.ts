import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput, AuthPayload, AuthUser } from './dto/auth.dto';
import { GqlAuthGuard, CurrentUser } from '../common';
import type { CurrentUserPayload } from '../common';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthPayload)
  async login(@Args('input') loginInput: LoginInput): Promise<AuthPayload> {
    return this.authService.login(loginInput);
  }

  @Query(() => AuthUser)
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: CurrentUserPayload): Promise<AuthUser> {
    const fullUser = await this.authService.validateUser(user.userId);
    if (!fullUser) {
      throw new Error('User not found');
    }
    return {
      id: fullUser.id,
      email: fullUser.email,
      name: fullUser.name,
    };
  }
}
