import { DomainError } from 'Error';

enum UserType {
  Authenticated = 'authenticated',
  Anonymous = 'anonymous',
}

interface BaseUser {
  userType: UserType;
  ipAddress: string;
}

interface AuthenticatedUser extends BaseUser {
  username: string;
  authorities: Array<string>;
  id: string;
  ipAddress: string;
}

interface AnonymousUser extends BaseUser {}

type User = AuthenticatedUser | AnonymousUser;

function isAuthenticatedUser(user: User): user is AuthenticatedUser {
  return user.userType === UserType.Authenticated;
}
function asAuthenticatedUser(user: User): AuthenticatedUser {
  if (isAuthenticatedUser(user)) {
    return user;
  }
  throw new Error('Invalid authenticated used');
}

function isAnonymousUser(user: User): user is AnonymousUser {
  return user.userType === UserType.Anonymous;
}

class AnonymousUserException extends DomainError {
  name = 'AnonymousUserException';

  constructor(operationName: string) {
    super(`Anonymous user is not allowed for operation ${operationName}`);
  }
}

export {
  AnonymousUser,
  AuthenticatedUser,
  UserType,
  isAuthenticatedUser,
  isAnonymousUser,
  asAuthenticatedUser,
  AnonymousUserException,
};

export default User;
