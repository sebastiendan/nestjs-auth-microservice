export class CreateAuthUserDto {
  public readonly email: string
  public readonly password: string
}

export class VerifyUserByEmailDto {
  public readonly email: string
  public readonly password: string
}
