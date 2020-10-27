import { Request, Response } from 'UseCase';
import createController, { HandlersMap } from 'Handler';
import GreetingUseCase from 'greetingDomain/ports/in/greetingUseCase';

const greetingUseCase = new GreetingUseCase();

const handlersMap: HandlersMap<Request, Response> = {
  greet: {
    useCase: greetingUseCase,
    schema: {
      type: 'object',
    },
  },
};

const lambdaHandler = createController(handlersMap);

export default lambdaHandler;
