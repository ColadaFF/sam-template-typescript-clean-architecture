import { JSONSchema4 } from 'json-schema';
import middy from '@middy/core';
import jsonBoddyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import { Handler } from 'aws-lambda';
import Ajv from 'ajv';
import UseCase, { Response, Request } from 'utils/useCase';
import InputEvent, { createInputEventSchema } from './events';

interface ApplicationHandler<T extends Request, U extends Response> {
  schema: JSONSchema4;
  useCase: UseCase<T, U>;
}

export interface HandlersMap<T, U> {
  [key: string]: ApplicationHandler<T, U>;
}

interface InputDefinition<T, U> {
  handler: Handler<T, U>;
  inputSchema: JSONSchema4;
}
const makeHandler = <T, U>({
  handler,
  inputSchema,
}: InputDefinition<T, U>): middy.Middy<T, U> =>
  middy(handler).use(jsonBoddyParser()).use(validator({ inputSchema }));

function createController<T extends Request, U extends Response>(
  map: HandlersMap<T, U>
) {
  const ajv = new Ajv();
  const allowedTypes = Object.keys(map);
  const inputEventSchema = createInputEventSchema(allowedTypes);
  return makeHandler<InputEvent<T>, U>({
    handler: async event => {
      const handler = map[event.operation];
      const isValid = ajv.validate(handler.schema, event.arguments);
      if (isValid) {
        return handler.useCase.process(event.arguments, event.user);
      }
      throw new Error(ajv.errorsText());
    },
    inputSchema: inputEventSchema,
  });
}

export default createController;
