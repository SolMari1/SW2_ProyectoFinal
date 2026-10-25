import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(2, { message: 'El nombre es obligatorio' })
  @MaxLength(100)
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener mínimo 6 caracteres' })
  @MaxLength(72)
  password: string;
}
