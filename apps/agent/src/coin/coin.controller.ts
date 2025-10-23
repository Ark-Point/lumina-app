import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CoinService } from "./coin.service";
import {
  GetMetadataParamsSchema,
  ListMetadataQuerySchema,
  RecordMetadataSchema,
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

  @Post("metadata")
  @ApiOperation({
    summary: "Store coin metadata question and answer",
    description:
      "Record a question and agent answer pair inside coin metadata properties.",
  })
  @ApiResponse({ status: 201, description: "Metadata recorded" })
  async recordMetadata(@Body() body: unknown) {
    const parsed = RecordMetadataSchema.safeParse(body);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }

    const metadata = await this.coinService.recordQuestionAndAnswer(
      parsed.data
    );
    return {
      statusCode: 201,
      data: metadata,
    };
  }

  @Get("metadata")
  @ApiOperation({
    summary: "List coin metadata",
    description:
      "Retrieve coin metadata records filtered by chain or owner address.",
  })
  @ApiResponse({ status: 200, description: "Metadata list" })
  async listMetadata(@Query() query: Record<string, string | string[]>) {
    const normalizedQuery = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [
        key,
        Array.isArray(value) ? value[value.length - 1] : value,
      ])
    );

    const parsed = ListMetadataQuerySchema.safeParse(normalizedQuery);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }

    const items = await this.coinService.listMetadata(parsed.data);
    return {
      statusCode: 200,
      data: items,
    };
  }

  @Get("metadata/:chainId/:ownerAddress/:metadataId")
  @ApiOperation({
    summary: "Get coin metadata by owner",
    description: "Retrieve a single metadata record for the provided owner.",
  })
  @ApiResponse({ status: 200, description: "Metadata detail" })
  async getMetadata(@Param() params: Record<string, string>) {
    const parsed = GetMetadataParamsSchema.safeParse(params);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.format());
    }

    const metadata = await this.coinService.getMetadata(parsed.data);
    // return {
    //   statusCode: 200,
    //   data: metadata,
    // };
    return metadata;
  }
}
