import TestSession from 'adaptative-tests/domain/TestSession';

interface TestsSessionsRepository {
  createTestSession(testSession: TestSession): Promise<TestSession>;

  deleteTestSession(id: string): Promise<TestSession>;
}

export default TestsSessionsRepository;
