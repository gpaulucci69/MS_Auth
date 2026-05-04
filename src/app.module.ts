import { Module } from '@nestjs/common';
import { 
  KeycloakConnectModule, 
  ResourceGuard, 
  RoleGuard, 
  AuthGuard 
} from 'nest-keycloak-connect';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    KeycloakConnectModule.register({
      authServerUrl: process.env.KEYCLOAK_AUTH_SERVER_URL, // http://keycloak:8080
      realm: process.env.KEYCLOAK_REALM,                  // Quasar_Solutions
      clientId: process.env.KEYCLOAK_CLIENT_ID,          // ms-auth-backend
      secret: process.env.KEYCLOAK_CLIENT_SECRET,        // El que sacaste de la UI
      // Esto es clave para que funcione dentro de Docker
      policyEnforcer: PolicyEnforcementMode.PERMISSIVE,
      tokenValidation: TokenValidation.ONLINE, 
    }),
  ],
  providers: [
    // Estos Guards protegen TODA la aplicación por defecto
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ResourceGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
  ],
})
export class AppModule {}