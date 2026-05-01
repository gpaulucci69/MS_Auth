import { Controller, Get, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth') // <--- Esto define la base: /auth
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('login') // <--- Esto define el endpoint: /auth/login
  login(@Res() res) {
    const url = this.authService.getAuthorizationUrl();
    return res.redirect(url);
  }

  // Asegúrate de tener también el callback para que Keycloak pueda volver
  @Get('callback')
  async callback() {
    // lógica de intercambio de token
  }
}