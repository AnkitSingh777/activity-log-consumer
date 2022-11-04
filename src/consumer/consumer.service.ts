import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as AWS from "aws-sdk";
import { Consumer } from "sqs-consumer";
import { QueueException } from "./customErrors";
import { IActivityLog, QueueData } from "./interface";

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
});
AWS.config.getCredentials((err: Error) => {
  if (err) {
    const error = "Aws connection error. Msg: " + err.message;
    throw new InternalServerErrorException(error);
  }
});
const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });
@Injectable()
export class ConsumerService {
  constructor() {}
  async consumer(): Promise<void> {
    const consumer = Consumer.create({
      queueUrl: process.env.ACTIVITY_LOG_QUEUE_URL,
      handleMessage: async (data) => {
        const result: QueueData = {
          message: <IActivityLog>JSON.parse(data.Body),
          receiptHandle: data.ReceiptHandle,
        };
        this.dequeue(result);
      },
    });
    consumer.on("error", (err) => {
      console.error("----error--->", err.message);
    });
    consumer.on("processing_error", (err) => {
      console.error("----processing error-->", err.message);
    });
    consumer.start();
  }

  dequeue = async (result: QueueData): Promise<boolean> => {
    try {
      console.log("----dequeue data---->", result);
      //delete the data when queued data recevied and processed successfully
      const isDeleted: boolean = await this.deleteData(result.receiptHandle);
      return isDeleted;
    } catch (error) {
      throw new QueueException(error);
    }
  };

  deleteData = async (receiptHandle: string): Promise<boolean> => {
    try {
      const deleteParams = {
        QueueUrl: process.env.ACTIVITY_LOG_QUEUE_URL,
        ReceiptHandle: receiptHandle,
      };
      const result: boolean = await Promise.resolve(
        new Promise((resolve, reject) => {
          sqs.deleteMessage(deleteParams, (err, data) => {
            if (err) {
              reject(
                new QueueException({
                  code: {
                    code: "E_013",
                    message: "Unable to delete data from queue",
                  },
                  message: err,
                })
              );
            } else {
              console.log("----deleted data from queue---->", data);
              resolve(true);
            }
          });
        })
      );
      if (result) return true;
      else return false;
    } catch (error) {
      throw new QueueException(error);
    }
  };
}
