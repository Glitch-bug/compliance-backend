import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

/**
 * A custom guard to protect endpoints with a static API key.
 * It checks for the presence of an 'x-api-key' header and validates its value
 * against the API_KEY configured in the environment variables.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key']; // Header names are converted to lowercase by convention

    const validApiKey = this.configService.get<string>('API_KEY');

    if (!validApiKey) {
        // This is a server configuration error and should not happen in production.
        // It prevents the route from being exposed if the key isn't set.
        throw new Error('API_KEY is not configured on the server.');
    }

    if (apiKey === validApiKey) {
      // If the key matches, allow the request to proceed.
      return true;
    } else {
      // If the key is missing or invalid, throw an UnauthorizedException.
      throw new UnauthorizedException('Invalid or missing API Key');
    }
  }
}
