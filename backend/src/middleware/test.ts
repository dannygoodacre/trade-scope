import { ZodError } from 'zod';

interface RFC9457ProblemDetails {
  type: string | 'about:blank';
  title: string;
  status: number;
  detail: string;
  instance?: string;
  // Extension members go here
  errors?: Array<{
    pointer: string; // RFC 6901 JSON Pointer or simple dot path
    message: string;
  }>;
}

export function mapZodErrorToProblemDetails(err: ZodError, instanceUri?: string): RFC9457ProblemDetails {
  const detail =
    err.issues.length === 1
      ? `Validation failed: ${err.issues[0].message}`
      : `${err.issues.length} validation errors occurred.`;

  return {
    type: 'TODO: a URL providing some validation error information',
    title: 'Validation Failed',
    status: 400,
    detail: detail,
    instance: instanceUri,
    errors: err.issues.map(issue => ({
      pointer: issue.path.length > 0 ? `/${issue.path.join('/')}` : '/',
      message: issue.message
    }))
  };
}
