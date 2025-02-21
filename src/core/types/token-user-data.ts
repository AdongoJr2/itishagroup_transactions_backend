import * as jwt from 'jsonwebtoken';
import { DeepPartial } from 'typeorm';
import { User } from '../../features/users/entities/user.entity';

export type TokenUserData = Pick<
  User,
  'id'
>;

export type TokenType = 'access' | 'refresh';

// export type VerifiedToken = DeepPartial<User> & jwt.JwtPayload;
export type VerifiedToken = DeepPartial<TokenUserData> & jwt.JwtPayload;
