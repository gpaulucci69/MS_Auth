import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller'; // <--- Importar
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController], // <--- ¡Asegúrate de que esté aquí!
  providers: [AuthService],
})
export class AuthModule { }