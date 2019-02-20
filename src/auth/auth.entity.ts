import { Exclude } from 'class-transformer'
import { IsString } from 'class-validator'
import * as crypto from 'crypto'
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { AuthUserRoleEnum } from './auth.interfaces'

@Entity()
export class AuthUser {
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    default: '',
    length: 100,
  })
  public email: string

  @Column({
    default: AuthUserRoleEnum.REGULAR,
  })
  public role: AuthUserRoleEnum

  @CreateDateColumn({
    type: 'timestamp',
  })
  public createdAt: Date

  @UpdateDateColumn({
    type: 'timestamp',
  })
  public updatedAt: Date

  @Column({
    length: 75,
  })
  @IsString()
  @Exclude()
  public password: string

  @Column({
    length: 128,
  })
  @IsString()
  @Exclude()
  public passwordSalt: string

  @BeforeInsert()
  public async hashPasswordWithSalt() {
    const salt = this.generateRandomSalt(128)
    this.passwordSalt = salt
    this.password = crypto
      .createHmac('sha256', salt)
      .update(this.password)
      .digest('hex')
  }

  private generateRandomSalt(length: number): string {
    return crypto
      .randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
  }
}
