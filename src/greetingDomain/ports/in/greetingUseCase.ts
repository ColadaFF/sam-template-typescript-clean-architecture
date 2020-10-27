import UseCase, { Request, Response } from 'UseCase';
import User from 'User';

interface GreetingRequest extends Request {
  name: string;
}

interface GreetingResponse extends Response {
  greeting: string;
  user: User;
}

class GreetingUseCase implements UseCase<GreetingRequest, GreetingResponse> {
  process(
    input: GreetingRequest,
    user: User
  ): GreetingResponse | Promise<GreetingResponse> {
    return {
      greeting: `Hello there ${input.name}`,
      user,
    };
  }
}

export default GreetingUseCase;
