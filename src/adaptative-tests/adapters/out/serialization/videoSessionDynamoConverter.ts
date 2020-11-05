import { AttributeValue } from 'aws-sdk/clients/dynamodb';
import Id from 'ID';
import { Converter } from 'utils/serialization';
import VideoSession, { VideoSessionStatus } from '../../../domain/VideoSession';

export type DynamoVideoSession = {
  PK: AttributeValue;
  SK: AttributeValue;
  Id: AttributeValue;
  Status: AttributeValue;
  TestSessionId: AttributeValue;
  User: AttributeValue;
  CreatedAt: AttributeValue;
};

class VideoSessionDynamoConverter
  implements Converter<VideoSession, DynamoVideoSession> {
  doForward(record: VideoSession): DynamoVideoSession {
    return {
      PK: {
        S: record.testSessionId,
      },
      SK: {
        S: `VIDEO_SESSION#${record.id.value}#${record.status}`,
      },
      Id: {
        S: record.id.value,
      },
      CreatedAt: {
        S: record.createdAt.toISOString(),
      },
      Status: {
        S: record.status,
      },
      TestSessionId: {
        S: record.testSessionId,
      },
      User: {
        S: record.userId,
      },
    };
  }

  doBackward(record: DynamoVideoSession): VideoSession {
    return VideoSession.fromCreated({
      createdAt: new Date(record.CreatedAt.S),
      id: Id.fromString(record.Id.S),
      status: VideoSessionStatus[record.Status.S],
      testSessionId: record.TestSessionId.S,
      userId: record.User.S,
    });
  }
}

const converter = new VideoSessionDynamoConverter();

export default converter;
