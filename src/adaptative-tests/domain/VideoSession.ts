import Id from 'ID';
import Preconditions from 'Preconditions';

export enum VideoSessionStatus {
  REGISTERED = 'REGISTERED',
  STARTED = 'REGISTERED',
  ENDED = 'ENDED',
}

type CreateVideoProps = {
  testSessionId: string;
  userId: string;
};

type VideoSessionProps = {
  id: Id;
  status: VideoSessionStatus;
  testSessionId: string;
  userId: string;
  createdAt: Date;
};

class VideoSession {
  readonly id: Id;

  readonly status: VideoSessionStatus;

  readonly testSessionId: string;

  readonly userId: string;

  readonly createdAt: Date;

  private constructor({
    id,
    status,
    testSessionId,
    userId,
    createdAt,
  }: VideoSessionProps) {
    this.id = Preconditions.checkNotNil(id, 'id can not be empty');
    this.status = Preconditions.checkNotNil(status, 'status can not be empty');
    this.testSessionId = Preconditions.checkNotNil(
      testSessionId,
      'testSessionId can not be empty'
    );
    this.userId = Preconditions.checkNotNil(userId, 'userId can not be empty');
    this.createdAt = Preconditions.checkNotNil(
      createdAt,
      'createdAt can not be empty'
    );
  }

  static fromProps(props: CreateVideoProps) {
    const creationDate = new Date();
    const videoSessionId = Id.fromDate(creationDate);
    return new VideoSession({
      id: videoSessionId,
      createdAt: creationDate,
      status: VideoSessionStatus.REGISTERED,
      testSessionId: props.testSessionId,
      userId: props.userId,
    });
  }

  static fromCreated(props: VideoSessionProps): VideoSession {
    return new VideoSession(props);
  }
}

export default VideoSession;
