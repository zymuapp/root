import { Type } from "class-transformer";
import {
  IsDate,
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

class UpdateUserIdentifierDto
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

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsLowercase()
  @Length(3, 48)
  @Matches(Regex.username)
  readonly username?: string;
}

class UpdateUserIdentityDto
  implements
    DeepPartial<
      Pick<
        UserIdentity,
        | "displayName"
        | "firstName"
        | "lastName"
        | "bio"
        | "birthDate"
        | "pronouns"
      >
    >
{
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(Regex.name)
  readonly displayName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(Regex.name)
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(Regex.name)
  readonly lastName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(Regex.bio)
  readonly bio?: string;

  @IsOptional()
  @IsDate()
  readonly birthDate?: Date;
}

export class UpdateUserDto {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserIdentifierDto)
  readonly identifier?: UpdateUserIdentifierDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateUserIdentityDto)
  readonly identity?: UpdateUserIdentityDto;

  @IsOptional()
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
  readonly password?: string;
}
