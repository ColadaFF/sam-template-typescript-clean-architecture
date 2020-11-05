export interface Converter<A, B> {
  doForward(record: A): B;
  doBackward(record: B): A;
}
