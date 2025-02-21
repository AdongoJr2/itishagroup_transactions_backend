import { Container } from 'inversify';
import { DataSource } from 'typeorm';
import AppDataSource from './database';
import { RefreshTokenService } from '../features/auth/services/refresh-token.service';
import { RefreshTokenRepository } from '../features/auth/repositories/refresh-token.repository';
import { AuthService } from '../features/auth/services/auth.service';
import { ApiResponseService } from '../features/_common/services/api-response.service';
import { UserService } from '../features/users/services/user.service';
import AuthController from '../features/auth/controllers/auth.controller';
import { TransactionController } from '../features/transactions/controllers/transaction.controller';
import { TransactionService } from '../features/transactions/services/transaction.service';

// Create the DI container
const container = new Container();

container.bind<DataSource>(DataSource).toConstantValue(AppDataSource);

// Bind repositories
container.bind<RefreshTokenRepository>(RefreshTokenRepository).toSelf();

// Bind services
container.bind<ApiResponseService>(ApiResponseService).toSelf();
container.bind<RefreshTokenService>(RefreshTokenService).toSelf();
container.bind<AuthService>(AuthService).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<TransactionService>(TransactionService).toSelf();

// Bind controllers
container.bind<AuthController>(AuthController).toSelf();
container.bind<TransactionController>(TransactionController).toSelf();

export default container;