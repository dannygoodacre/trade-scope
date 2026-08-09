import type { ValidationProblemDetails } from '@/types';

export class ApiError extends Error {
  details?: ValidationProblemDetails;

  constructor(message: string, details?: ValidationProblemDetails) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
  }
}
