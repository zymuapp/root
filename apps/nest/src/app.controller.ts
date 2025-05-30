import { Controller, Get } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {}

  @GrpcMethod("AuthService", "Find")
  async find() {}
}
