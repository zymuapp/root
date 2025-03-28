import { Type } from "class-transformer";
import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  ValidateNested,
} from "class-validator";
import { Regex } from "../../../constants";
import type { DeepPartial, UserIdentifier, UserIdentity } from "../../../types";

export class CreateUserDto {
  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserIdentifierDto)
  readonly identifier!: CreateUserIdentifierDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateUserIdentityDto)
  readonly identity!: CreateUserIdentityDto;

  @IsString()
  @IsNotEmpty()
  @Matches(Regex.password, {
    message: "Password must be secure",
  })
  @Matches(Regex.passwordMinLength, {
    message: "Password must be at least 8 characters long",
  })
  @Matches(Regex.passwordUppercase, {
    message: "Password must contain at least one uppercase letter",
  })
  @Matches(Regex.passwordLowercase, {
    message: "Password must contain at least one lowercase letter",
  })
  @Matches(Regex.PasswordNumberSpecial, {
    message: "Password must contain at least one number or special character",
  })
  readonly password!: string;
}

class CreateUserIdentifierDto
  implements
    DeepPartial<Pick<UserIdentifier, "email" | "phoneNumber" | "username">>
{
  @IsOptional()
  @IsString()
  @IsEmail()
  readonly email?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  readonly phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  @Length(3, 48)
  @Matches(Regex.username)
  readonly username!: string;
}

class CreateUserIdentityDto
  implements DeepPartial<Pick<UserIdentity, "displayName">>
{
  @IsString()
  @IsNotEmpty()
  @Matches(Regex.name)
  readonly displayName!: string;
}
