import DynamoDB from 'aws-sdk/clients/dynamodb';
import VideoSession from 'adaptative-tests/domain/VideoSession';
import VideoSessionRepository, {
  RegisterSesionResult,
} from 'adaptative-tests/ports/out/videoSessionsRepository';
import { ApplicationError, InfrastructureError } from 'Error';
import { pipe } from 'fp-ts/lib/pipeable';
import { TaskEither, chain, tryCatch } from 'fp-ts/lib/TaskEither';
import { OpenVidu, Recording, RecordingMode } from 'openvidu-node-client';
import preconditions from 'Preconditions';
import videoSessionDynamoConverter from './serialization/videoSessionDynamoConverter';

class AmazonVideoSessionRepository implements VideoSessionRepository {
  private dynamodb: DynamoDB;

  private openVidu: OpenVidu;

  constructor(dynamodb: DynamoDB, openVidu: OpenVidu) {
    this.dynamodb = preconditions.checkNotNil(dynamodb);
    this.openVidu = preconditions.checkNotNil(openVidu);
  }

  registerSession(
    videoSession: VideoSession
  ): TaskEither<ApplicationError, RegisterSesionResult> {
    const videoSessionId = videoSession.id.value;
    return pipe(
      tryCatch(
        () => {
          const dynamoRecord = videoSessionDynamoConverter.doForward(
            videoSession
          );
          return this.dynamodb
            .putItem({
              Item: dynamoRecord,
              TableName: process.env.TABLE_NAME,
            })
            .promise();
        },
        (error: Error) => {
          console.error(error);
          return new InfrastructureError(
            `Error creating record on dynamodb:${error.message}`
          );
        }
      ),
      chain(() =>
        tryCatch(
          async () => {
            console.log('about to create session');
            const session = await this.openVidu.createSession({
              customSessionId: videoSessionId,
              recordingMode: RecordingMode.ALWAYS,
              defaultOutputMode: Recording.OutputMode.INDIVIDUAL,
            });
            const screenToken = await session.generateToken({
              data: JSON.stringify({
                ...videoSession,
                type: 'screen',
              }),
            });
            const cameraToken = await session.generateToken({
              data: JSON.stringify({
                ...videoSession,
                type: 'camera',
              }),
            });

            return {
              videoSession,
              screenToken,
              cameraToken,
            };
          },
          (error: Error) =>
            new InfrastructureError(
              `Error creating openViduSession: ${error.message}`
            )
        )
      )
    );
  }
}

export default AmazonVideoSessionRepository;
