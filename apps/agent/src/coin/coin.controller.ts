import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { CoinService } from "./coin.service";

@Controller("coin")
export class CoinController {
  constructor(private readonly coinService: CoinService) {}

  @Get()
  @ApiOperation({
    summary: "Health check coin module endpoint",
    description: "Check if the server is running",
  })
  @ApiResponse({ status: 200, description: "Server is healthy" })
  healthCheckForGet() {
    return this.coinService.healthCheck();
  }
}
