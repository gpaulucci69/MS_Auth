import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Issuer, Client, TokenSet } from 'openid-client';

@Injectable()
export class AuthService implements OnModuleInit {
  private client!: Client;

  constructor(private readonly configService: ConfigService) { }

  async onModuleInit() {
    const authServerUrl = this.configService.get<string>('KEYCLOAK_AUTH_SERVER_URL')!;
    const realm = this.configService.get<string>('KEYCLOAK_REALM')!;

    // Limpiamos espacios y barras sobrantes
    const cleanBaseUrl = authServerUrl.trim().replace(/\/+$/, '');
    const cleanRealm = realm.trim();

    // URL que Keycloak espera para el descubrimiento OIDC
    const issuerUrl = `${cleanBaseUrl}/realms/${cleanRealm}`;

    console.log('--- VALIDACIÓN DE RUTA ---');
    console.log(`BASE: "${authServerUrl}"`);
    console.log(`REALM: "${realm}"`);
    console.log(`CONCATENADO: "${issuerUrl}"`);
    console.log('--------------------------');

    try {
      const issuer = await Issuer.discover(issuerUrl);
      console.log('Discovery exitoso!');

      this.client = new issuer.Client({
        client_id: this.configService.get<string>('KEYCLOAK_CLIENT_ID')!,
        client_secret: this.configService.get<string>('KEYCLOAK_CLIENT_SECRET')!,
        redirect_uris: [this.configService.get<string>('CALLBACK_URL')!],
        response_types: ['code'],
      });
    } catch (error: any) { // Usamos 'any' temporalmente para el debug del MVP
      console.error('--- ERROR DETALLADO ---');

      // Accedemos a las propiedades con seguridad
      const errorMessage = error?.message || 'Error desconocido';
      const errorResponse = error?.response?.body || 'Sin respuesta del cuerpo';

      console.error('Mensaje:', errorMessage);
      console.error('Detalle del servidor:', errorResponse);

      throw new InternalServerErrorException('Error de configuración en el servidor de identidad');
    }
  }

  getAuthorizationUrl(): string {
    return this.client.authorizationUrl({
      scope: 'openid profile email',
    });
  }

  async exchangeCodeForToken(code: string): Promise<TokenSet> {
    const callbackUrl = this.configService.get<string>('CALLBACK_URL')!;
    return await this.client.callback(callbackUrl, { code });
  }

  getLogoutUrl(idToken: string): string {
    return this.client.endSessionUrl({
      id_token_hint: idToken,
      post_logout_redirect_uri: 'http://localhost:3001/login',
    });
  }
}