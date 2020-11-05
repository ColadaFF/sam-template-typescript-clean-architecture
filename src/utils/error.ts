/* eslint max-classes-per-file: ["error", 4] */

enum ErrorType {
  DOMAIN,
  EVENT,
  INFRASTRUCTURE,
}

export abstract class ApplicationError extends Error {
  errorType: ErrorType;
}

export abstract class DomainError extends ApplicationError {
  readonly errorType = ErrorType.DOMAIN;

  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, DomainError);
  }
}

export abstract class EventProcessingError extends ApplicationError {
  readonly errorType = ErrorType.EVENT;

  constructor(name: string, message: string) {
    super(message);
    this.name = name;
    Error.captureStackTrace(this, EventProcessingError);
  }
}

export class InfrastructureError extends ApplicationError {
  readonly errorType = ErrorType.INFRASTRUCTURE;

  constructor(message: string) {
    super(message);
    Error.captureStackTrace(this, InfrastructureError);
  }
}
