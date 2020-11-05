import AWS from 'aws-sdk';
import { OpenVidu } from 'openvidu-node-client/lib/OpenVidu';
import Controller from 'Controller';
import createControllers from 'Handler';
import RegisterVideoSessionUseCase from '../../ports/in/register-video-session-use-case';
import AmazonVideoSessionRepository from '../out/openViduSessionsRepository';

const dynamodb = new AWS.DynamoDB({
  apiVersion: '2012-08-10',
});

const openvidu = new OpenVidu(
  process.env.OPENVIDU_URL,
  process.env.OPENVIDU_SECRET
);

const videoSessionRepository = new AmazonVideoSessionRepository(
  dynamodb,
  openvidu
);

const registerSessionUseCase = new RegisterVideoSessionUseCase(
  videoSessionRepository
);
const registerSessionController = Controller.of({
  schema: {
    type: 'object',
    properties: {
      session: {
        type: 'object',
        properties: {
          testSessionId: {
            type: 'string',
          },
        },
        required: ['testSessionId'],
      },
    },
    required: ['session'],
  },
  useCase: registerSessionUseCase,
  preProcess: request => request.session,
  postProcess: ({ cameraToken, screenToken, videoSession }) => ({
    ...videoSession,
    cameraToken,
    screenToken,
  }),
});

const lambdaHandler = createControllers({
  registerVideoSession: registerSessionController,
});

export default lambdaHandler;
