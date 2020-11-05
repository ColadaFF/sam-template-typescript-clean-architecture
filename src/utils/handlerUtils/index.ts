import { JSONSchema4 } from 'json-schema';
import middy from '@middy/core';
import jsonBoddyParser from '@middy/http-json-body-parser';
import validator from '@middy/validator';
import { Handler } from 'aws-lambda';
import Ajv from 'ajv';
import Controller from 'Controller';

import { ApplicationRequest, ApplicationResponse } from 'UseCase';
import InputEvent, { createInputEventSchema } from './events';
import extractAppSyncBody from './extractors';

export interface ControllersMap<
  A extends ApplicationRequest,
  B extends ApplicationResponse
> {
  [key: string]: Controller<A, B>;
}

const logger = (step: string): middy.MiddlewareObject<any, any> => ({
  before: (
    handler: middy.HandlerLambda<any, any>,
    next: middy.NextFunction
  ) => {
    console.log(step, { event: handler.event });
    next();
  },
});

interface InputDefinition<T, U> {
  handler: Handler<T, U>;
  inputSchema: JSONSchema4;
}
const makeHandler = <T, U>({
  handler,
  inputSchema,
}: InputDefinition<T, U>): middy.Middy<T, U> =>
  middy(handler)
    .use(jsonBoddyParser())
    .use(logger('pre'))
    .use(extractAppSyncBody())
    .use(logger('post'))
    .use(validator({ inputSchema }));

function createControllers<
  T extends ApplicationRequest,
  U extends ApplicationResponse
>(map: ControllersMap<T, U>) {
  const ajv = new Ajv();
  const allowedTypes = Object.keys(map);
  const inputEventSchema = createInputEventSchema(allowedTypes);
  return makeHandler<InputEvent<T>, U>({
    handler: async event => {
      const controller = map[event.operation];
      const isValid = ajv.validate(controller.schema, event.arguments);
      if (isValid) {
        return controller.run(event.arguments, event.user);
      }
      throw new Error(ajv.errorsText());
    },
    inputSchema: inputEventSchema,
  });
}

export default createControllers;
