/* eslint @typescript-eslint/no-unused-vars: "off" */

import TestSession from 'adaptative-tests/domain/TestSession';
import TestsSessionsRepository from 'adaptative-tests/ports/out/testsSessionRepository';

class DynamoTestSessionRepository implements TestsSessionsRepository {
  createTestSession(testSession: TestSession): Promise<TestSession> {
    throw new Error('Method not implemented.');
  }

  deleteTestSession(_id: string): Promise<TestSession> {
    throw new Error('Method not implemented.');
  }
}

export default DynamoTestSessionRepository;
