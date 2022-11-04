require("dotenv").config();
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";

async function bootstrap() {
  const logger = new Logger("bootstrap");

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(process.env.PORT);
  logger.log(`Application listening on port ${process.env.PORT}`);
}
bootstrap();
