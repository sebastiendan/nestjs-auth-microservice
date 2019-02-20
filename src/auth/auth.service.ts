import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'
import { InjectRepository } from '@nestjs/typeorm'
import * as crypto from 'crypto'
import { Repository } from 'typeorm'

import { CreateAuthUserDto, VerifyUserByEmailDto } from './auth.dto'
import { AuthUser } from './auth.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthUser)
    private readonly authUserRepository: Repository<AuthUser>
  ) {}

  public async getAuthUser(id: number): Promise<AuthUser> {
    return this.authUserRepository
      .findOneOrFail({ id })
      .catch(() => {
        throw new RpcException(
          new NotFoundException('User with provided id does not exist')
        )
      })
      .then(user => this.toPublicUser(user))
  }

  public async createAuthUser(
    createAuthUserDto: CreateAuthUserDto
  ): Promise<AuthUser> {
    const emailUser = await this.authUserRepository.findOne({
      email: createAuthUserDto.email,
    })
    if (emailUser) {
      throw new RpcException(
        new ConflictException(
          'User with provided email or phone number already exists'
        )
      )
    }

    return this.toPublicUser(
      await this.authUserRepository.save(
        Object.assign(new AuthUser(), createAuthUserDto)
      )
    )
  }

  public async verifyAuthUserByEmail(dto: VerifyUserByEmailDto) {
    const auth = await this.authUserRepository.findOne({ email: dto.email })
    if (!auth) {
      throw new RpcException(
        new UnauthorizedException('User with provided email does not exist')
      )
    }

    const passHash = crypto
      .createHmac('sha256', auth.passwordSalt)
      .update(dto.password)
      .digest('hex')
    if (auth.password === passHash) {
      return this.toPublicUser(auth)
    } else {
      throw new RpcException(new UnauthorizedException('Password is incorrect'))
    }
  }

  private toPublicUser(auth: AuthUser): any {
    const { password, passwordSalt, ...publicUser } = auth
    return publicUser
  }
}
