import { IsEmail, IsString, MinLength } from 'class-validator'; // [cite: 66, 67]

export class LoginDto {
  @IsEmail({}, { message: 'El formato del correo es inválido' }) // [cite: 67]
  email: string;

  @IsString() // [cite: 67]
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}