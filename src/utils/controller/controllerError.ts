import { EventProcessingError } from 'Error';

export enum ControllerErrorType {
  PRE_PROCESS = 'PreProcess Error',
  POST_PROCESS = 'PostProcess Error',
}

class ControllerError extends EventProcessingError {
  readonly phase: ControllerErrorType;

  private constructor(phase: ControllerErrorType, message: any) {
    super(phase, message);
    this.phase = phase;
    Error.captureStackTrace(this, ControllerError);
  }

  static ofPreProcess(message: string) {
    return new ControllerError(ControllerErrorType.PRE_PROCESS, message);
  }

  static ofPostProcess(message: string) {
    return new ControllerError(ControllerErrorType.POST_PROCESS, message);
  }
}

export default ControllerError;
