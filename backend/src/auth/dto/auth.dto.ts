import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(4)
  password: string;
}

@ObjectType()
export class AuthUser {
  @Field()
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;
}

@ObjectType()
export class AuthPayload {
  @Field()
  accessToken: string;

  @Field(() => AuthUser)
  user: AuthUser;
}
