import VideoSessionRepository from 'adaptative-tests/ports/out/videoSessionsRepository';
import { ApplicationError } from 'Error';
import { pipe } from 'fp-ts/lib/pipeable';
import { TaskEither, tryCatch, chain, left, map } from 'fp-ts/lib/TaskEither';
import Preconditions from 'Preconditions';
import UseCase, { ApplicationRequest, ApplicationResponse } from 'UseCase';
import {
  isAnonymousUser,
  AnonymousUserException,
  asAuthenticatedUser,
} from 'User';
import VideoSession from '../../../domain/VideoSession';
import { InvalidPropsException } from './errors';

interface RegisterVideoSessionRequest extends ApplicationRequest {
  testSessionId: string;
}

interface RegisterVideoSessionResponse extends ApplicationResponse {
  videoSession: VideoSession;
  cameraToken: string;
  screenToken: string;
}

class RegisterVideoSessionUseCase
  implements
    UseCase<RegisterVideoSessionRequest, RegisterVideoSessionResponse> {
  readonly videoSessionRepository: VideoSessionRepository;

  constructor(videoSessionRepository: VideoSessionRepository) {
    this.videoSessionRepository = Preconditions.checkNotNil(
      videoSessionRepository
    );
  }

  process(
    input: RegisterVideoSessionRequest
  ): TaskEither<ApplicationError, RegisterVideoSessionResponse> {
    if (isAnonymousUser(input.user)) {
      return left(new AnonymousUserException('Register Video Session'));
    }
    const user = asAuthenticatedUser(input.user);

    return pipe(
      tryCatch(
        async () =>
          VideoSession.fromProps({
            testSessionId: input.testSessionId,
            userId: user.id,
          }),
        (error: Error) =>
          new InvalidPropsException(
            `Invalid props for video session: ${error.message}`
          )
      ),
      chain(videoSession =>
        this.videoSessionRepository.registerSession(videoSession)
      ),
      map(session => {
        return {
          ...session,
          operationId: input.operationId,
        };
      })
    );
  }
}

export default RegisterVideoSessionUseCase;
