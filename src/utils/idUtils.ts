import KSUID from 'ksuid';
import crypto from 'crypto';
import preconditions from 'Preconditions';

class Id {
  private readonly ksuid: KSUID;

  private constructor(value: KSUID) {
    this.ksuid = preconditions.checkNotNil(value);
  }

  get value() {
    return this.ksuid.string;
  }

  toJSON() {
    return this.value;
  }

  static fromDate(timestamp: Date) {
    const payload = crypto.randomBytes(16);
    const value = KSUID.fromParts(timestamp.valueOf(), payload);
    return new Id(value);
  }

  static fromString(value: string) {
    const parsed = KSUID.parse(value);
    return new Id(parsed);
  }
}

export default Id;
