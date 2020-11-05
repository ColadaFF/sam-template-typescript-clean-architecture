import { identity } from 'lodash-es';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import { JSONSchema4 } from 'json-schema';
import UseCase, { ApplicationRequest, ApplicationResponse } from 'UseCase';
import { ApplicationError } from 'Error';
import User from 'User';
import { isLeft } from 'fp-ts/lib/Either';
import ControllerError from './controllerError';

type PreProcessType<A extends ApplicationRequest> = (input: any) => A;
type PostProcessType<B extends ApplicationResponse> = (output: B) => any;

interface CreateControllerProps<
  A extends ApplicationRequest,
  B extends ApplicationResponse
> {
  useCase: UseCase<A, B>;
  schema: JSONSchema4;
  preProcess?: PreProcessType<A>;
  postProcess?: PostProcessType<B>;
}

function createPreProcess<A extends ApplicationRequest>(
  preprocessFn: PreProcessType<A>,
  controllerEvent: ControllerEvent
): TE.TaskEither<ApplicationError, A> {
  return TE.tryCatch<ApplicationError, A>(
    async () => {
      const result = preprocessFn(controllerEvent.event);
      return {
        operationId: controllerEvent.requestId,
        user: controllerEvent.user,
        ...result,
      };
    },
    (err: Error) => ControllerError.ofPreProcess(err.message)
  );
}

function createPostProcess<B extends ApplicationResponse>(
  response: B,
  postProcessFn: PostProcessType<B>
): TE.TaskEither<ApplicationError, any> {
  return TE.tryCatch(
    async () => postProcessFn(response),
    (err: Error) => ControllerError.ofPostProcess(err.message)
  );
}

type ControllerEvent = {
  event: any;
  user: User;
  requestId: string;
};

class Controller<A extends ApplicationRequest, B extends ApplicationResponse> {
  readonly schema: JSONSchema4;

  private useCase: UseCase<A, B>;

  private preProcess: PreProcessType<A>;

  private postProcess: PostProcessType<B>;

  private constructor(
    useCase: UseCase<A, B>,
    schema: JSONSchema4,
    preProcess: PreProcessType<A>,
    postProcess: PostProcessType<B>
  ) {
    this.useCase = useCase;
    this.schema = schema;
    this.preProcess = preProcess;
    this.postProcess = postProcess;
  }

  // factory
  static of<C extends ApplicationRequest, D extends ApplicationResponse>({
    useCase,
    schema,
    ...props
  }: CreateControllerProps<C, D>) {
    const preProcess = props.preProcess || identity;
    const postProcess = props.postProcess || identity;
    return new Controller(useCase, schema, preProcess, postProcess);
  }

  async run(event: any, user: User): Promise<any> {
    const requestId = '';
    const controllerEvent: ControllerEvent = {
      event,
      user,
      requestId,
    };
    const result = await pipe(
      createPreProcess(this.preProcess, controllerEvent),
      TE.chain(request => this.useCase.process(request)),
      TE.chain(response => createPostProcess(response, this.postProcess))
    )();
    if (isLeft(result)) {
      return Promise.reject(result.left);
    }
    return Promise.resolve(result.right);
  }
}

export default Controller;
