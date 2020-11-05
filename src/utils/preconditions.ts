import { isNil } from 'lodash-es';

function checkNotNil<T>(
  value: T,
  errorMessage: string = 'Null or undefined value'
) {
  if (isNil(value)) {
    throw new Error(`NullPointerException: ${errorMessage}`);
  }
  return value;
}

export default {
  checkNotNil,
};
