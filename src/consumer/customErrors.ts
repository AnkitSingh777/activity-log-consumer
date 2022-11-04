import { HttpException } from "@nestjs/common";

export class QueueException extends HttpException {
  constructor(errorMessage) {
    super(errorMessage, 500);
  }
}
