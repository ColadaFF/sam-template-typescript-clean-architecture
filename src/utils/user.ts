enum UserType {
  Authenticated = 'authenticated',
  Anonymous = 'anonymous',
}

interface BaseUser {
  type: UserType;
  ip: string;
}

interface AuthenticatedUser extends BaseUser {
  username: string;
  authorities: Array<string>;
  id: string;
  ip: string;
}

interface AnonymousUser extends BaseUser {}

type User = AuthenticatedUser | AnonymousUser;

function isAuthenticatedUser(user: User) {
  return user.type === UserType.Authenticated;
}

function isAnonymousUser(user: User) {
  return user.type === UserType.Anonymous;
}

export {
  AnonymousUser,
  AuthenticatedUser,
  UserType,
  isAuthenticatedUser,
  isAnonymousUser,
};

export default User;
