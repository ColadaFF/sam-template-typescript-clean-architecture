import User from './user';

export interface Request {}
export interface Response {}

interface UseCase<T extends Request, U extends Response> {
  process(input: T, user: User): Promise<U> | U;
}

export default UseCase;
