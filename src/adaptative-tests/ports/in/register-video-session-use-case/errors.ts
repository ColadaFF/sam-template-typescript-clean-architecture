/* eslint max-classes-per-file: ["error", 2] */

import { DomainError } from 'Error';

export class InvalidPropsException extends DomainError {}

export class RegisterVideoSessionError extends DomainError {}

export default {
  InvalidPropsException,
  RegisterVideoSessionError,
};
