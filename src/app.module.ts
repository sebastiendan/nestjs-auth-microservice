import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as dotenv from 'dotenv'

import { AuthModule } from './auth/auth.module'

dotenv.config()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      database: 'auth',
      entities: [__dirname + '/../**/*.entity{.ts, .js}'],
      host: process.env.DB_HOST,
      password: process.env.DB_ADMIN_PASSWORD,
      port: 3306,
      ssl: true,
      synchronize: true,
      type: 'mysql',
      username: process.env.DB_ADMIN_USERNAME,
    }),
    AuthModule,
  ],
})
export class AppModule {}
