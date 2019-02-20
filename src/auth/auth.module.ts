import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AuthController } from './auth.controller'
import { AuthUser } from './auth.entity'
import { AuthService } from './auth.service'

@Module({
  controllers: [AuthController],
  imports: [TypeOrmModule.forFeature([AuthUser])],
  providers: [AuthService],
})
export class AuthModule {}
