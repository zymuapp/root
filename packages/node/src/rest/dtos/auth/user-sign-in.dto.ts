import { IsNotEmpty, IsString } from "class-validator";

export class UserSignInDto {
  @IsNotEmpty()
  @IsString()
  readonly identifier: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}
