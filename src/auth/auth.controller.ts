import { Controller, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, Roles } from 'nest-keycloak-connect';

@Controller('auth') // <--- Esto define la base: /auth
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('login') // <--- Esto define el endpoint: /auth/login
  @Public()
  login(@Res() res) {
    const url = this.authService.getAuthorizationUrl();
    return res.redirect(url);
  }

  @Get('publico')
  @Public()
  findAllFree() {
    return 'Cualquiera puede ver esto';
  }

  @Get('privado')
  @Roles({ roles: ['admin'] }) // Solo usuarios con rol 'admin'
  findOneSafe() {
    return 'Solo tú puedes ver esto si tienes el token y el rol';
  }

  // Asegúrate de tener también el callback para que Keycloak pueda volver
  @Get('callback')
  async callback() {
    // lógica de intercambio de token
  }
}