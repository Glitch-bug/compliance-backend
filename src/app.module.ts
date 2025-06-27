import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { GrantsModule } from './grants/grants.module';
import { AssetsModule } from './assets/assets.module';
import { ChecklistsModule } from './checklists/checklists.module';
import { AdminModule } from './admin/admin.module';
import { InsightsModule } from './insights/insights.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    AuthModule,
    UsersModule,
    RequestsModule,
    GrantsModule,
    AssetsModule,
    ChecklistsModule,
    AdminModule,
    InsightsModule
  ],
})
export class AppModule {}
