import { Controller, UseFilters } from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'

import { ExceptionFilter } from '../common/filters/exception.filter'
import { CreateAuthUserDto, VerifyUserByEmailDto } from './auth.dto'
import { AuthService } from './auth.service'

@Controller()
@UseFilters(ExceptionFilter)
export class AuthController {
  public constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'createAuthUser' })
  public async createAuthUser(
    createAuthUserDto: CreateAuthUserDto
  ): Promise<any> {
    return this.authService.createAuthUser(createAuthUserDto)
  }

  @MessagePattern({ cmd: 'getAuthUser' })
  public async getAuthUser(id: number): Promise<any> {
    return this.authService.getAuthUser(id)
  }

  @MessagePattern({ cmd: 'verifyAuthUserByEmail' })
  public async verifyUserByEmail(dto: VerifyUserByEmailDto): Promise<any> {
    return this.authService.verifyAuthUserByEmail(dto)
  }
}
