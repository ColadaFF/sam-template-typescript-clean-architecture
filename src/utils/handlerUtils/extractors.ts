import middy from '@middy/core';
import User, { UserType } from 'User';
import InputEvent from './events';

type CognitoIdentity = {
  sourceIp: Array<string>;
  sub: string;
  username: string;
  groups: Array<string>;
};

type AppSyncIdentity = CognitoIdentity | null;

interface AppSyncInfo {
  fieldName: string;
  variables: object;
}

interface AppSyncRequest {
  headers: {
    ['x-forwarded-for']: string;
  };
}

interface AppSyncEvent {
  arguments: object;
  source: object | null;
  identity: AppSyncIdentity;
  info: AppSyncInfo;
  request: AppSyncRequest;
}

function isCognitoUser(identity: AppSyncIdentity): identity is CognitoIdentity {
  return identity?.sub !== undefined;
}

function getUserFromEvent(event: AppSyncEvent): User {
  const { identity, request } = event;
  if (isCognitoUser(identity)) {
    return {
      authorities: identity.groups,
      id: identity.sub,
      ipAddress: identity.sourceIp[0],
      userType: UserType.Authenticated,
      username: identity.username,
    };
  }
  return {
    userType: UserType.Anonymous,
    ipAddress: request.headers['x-forwarded-for'].split(', ')[0],
  };
}

const extractAppSyncBody = (): middy.MiddlewareObject<any, any> => ({
  before: (
    handler: middy.HandlerLambda<any, any>,
    next: middy.NextFunction
  ) => {
    const { arguments: args, info, source }: AppSyncEvent = handler.event;

    const inputEvent: InputEvent<any> = {
      arguments: { ...source, ...args, ...info.variables },
      operation: info.fieldName,
      user: getUserFromEvent(handler.event),
    };

    // eslint-disable-next-line
    handler.event = inputEvent;

    next();
  },
});

export default extractAppSyncBody;
