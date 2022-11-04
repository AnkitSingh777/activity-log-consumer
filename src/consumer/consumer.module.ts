import { Module, OnModuleInit } from "@nestjs/common";
import { ConsumerService } from "./consumer.service";

@Module({
  controllers: [],
  imports: [],
  providers: [ConsumerService],
  exports: [ConsumerService],
})
export class ConsumerModule implements OnModuleInit {
  constructor(private readonly activityLogSqsConsumer: ConsumerService) {}
  onModuleInit() {
    /** instantiate sqs consumer */
    this.activityLogSqsConsumer.consumer();
  }
}
