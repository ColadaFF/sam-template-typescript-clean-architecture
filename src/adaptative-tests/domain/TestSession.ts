import Id from 'ID';
import Preconditions from 'Preconditions';

type CreateTestSessionProps = {
  user: string;
  test: string;
};

class TestSession {
  readonly id: Id;

  readonly user: string;

  readonly test: string;

  readonly creationDate: Date;

  private constructor(id: Id, user: string, test: string, creationDate: Date) {
    this.id = Preconditions.checkNotNil(id, 'Test Session Id can not be null');
    this.user = Preconditions.checkNotNil(
      user,
      'Test Session user id can not be null'
    );
    this.test = Preconditions.checkNotNil(
      test,
      'Test Session test id can not be null'
    );
    this.creationDate = Preconditions.checkNotNil(
      creationDate,
      'Test Session creation date can not be null'
    );
  }

  static of(props: CreateTestSessionProps) {
    const creationDate = new Date();
    const testSessionId = Id.fromDate(creationDate);
    return new TestSession(testSessionId, props.user, props.test, creationDate);
  }
}

export default TestSession;
