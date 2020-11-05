import { TaskEither } from 'fp-ts/lib/TaskEither';
import { ApplicationError } from 'Error';

import VideoSession from 'adaptative-tests/domain/VideoSession';

export type RegisterSesionResult = {
  videoSession: VideoSession;
  cameraToken: string;
  screenToken: string;
};

interface VideoSessionRepository {
  registerSession(
    videoSession: VideoSession
  ): TaskEither<ApplicationError, RegisterSesionResult>;
}

export default VideoSessionRepository;
