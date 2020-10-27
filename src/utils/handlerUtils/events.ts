import { JSONSchema4 } from 'json-schema';
import User from 'utils/user';

interface InputEvent<T> {
  operation: string;
  arguments: T;
  user: User;
}

export function createInputEventSchema(
  allowedOperations: Array<string>
): JSONSchema4 {
  return {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: allowedOperations,
      },
      arguments: {
        type: 'object',
      },
      user: {
        anyOf: [
          {
            $ref: '#/definitions/authenticatedUser',
          },
          {
            $ref: '#/definitions/anonymousUser',
          },
        ],
      },
    },
    definitions: {
      authenticatedUser: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
          },
          authorities: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
          id: {
            type: 'string',
          },
          userType: {
            type: 'string',
            pattern: '^authenticated$',
          },
          ipAddress: {
            type: 'string',
          },
        },
        required: ['username', 'authorities', 'id', 'userType', 'ipAddress'],
      },
      anonymousUser: {
        type: 'object',
        properties: {
          userType: {
            type: 'string',
            pattern: '^anonymous$',
          },
          ipAddress: {
            type: 'string',
            format: 'ipv4',
          },
        },
        required: ['userType'],
      },
    },
    required: ['operation', 'arguments', 'user'],
  };
}

export default InputEvent;
