import { TaskEither } from 'fp-ts/lib/TaskEither';
import User from 'User';
import { ApplicationError } from 'Error';

export interface ApplicationRequest {
  readonly operationId: string;
  readonly user: User;
}

export interface ApplicationResponse {
  readonly operationId: string;
}

export type ApplicationRequestType<T extends ApplicationRequest> = T;
export type ApplicationResponseType<T extends ApplicationResponse> = T;

interface UseCase<T extends ApplicationRequest, U extends ApplicationResponse> {
  process(input: T): TaskEither<ApplicationError, U>;
}

export default UseCase;
