export abstract class AppError extends Error {
  constructor(message: string) {
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {

}
