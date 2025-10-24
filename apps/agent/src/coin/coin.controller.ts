import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CoinService } from "./coin.service";
import {
  RecordDeploymentSchema,
  SymbolAvailabilityQuerySchema,
} from "./dto";

@ApiTags("coin")
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

  @Post("deployments")
  @ApiOperation({
    summary: "Record a deployed coin",
    description:
      "Persist deployment details (tx hash, coin address, name, symbol) after a successful Zora deployment.",
  })
  @ApiResponse({ status: 201, description: "Deployment recorded" })
  async recordDeployment(@Body() body: unknown) {
    const parsed = RecordDeploymentSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }

    const deployment = await this.coinService.recordDeployment(parsed.data);
    return {
      statusCode: 201,
      data: deployment,
    };
  }

  @Get("symbol/availability")
  @ApiOperation({
    summary: "Check token symbol availability",
    description: "Verify whether a symbol already exists for a given chain.",
  })
  @ApiResponse({ status: 200, description: "Symbol availability result" })
  async checkSymbol(@Query() query: Record<string, string | string[]>) {
    const normalizedQuery = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[value.length - 1] : value,
      ])
    );

    const parsed = SymbolAvailabilityQuerySchema.safeParse(normalizedQuery);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }

    const result = await this.coinService.isSymbolAvailable(parsed.data);
    return {
      statusCode: 200,
      data: result,
    };
  }
}
