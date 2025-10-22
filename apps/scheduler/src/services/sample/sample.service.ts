import {
  ChainRepository,
  DexInfoRepository,
  DexProtocolRepository,
  ProtocolRepository,
  StableCoinRepository,
  YieldPoolRepository,
} from "@lumina-app/database";
import { Injectable, Logger } from "@nestjs/common";
import Axios, { AxiosInstance } from "axios";
import { DataSource } from "typeorm";

@Injectable()
export class SampleService {
  private readonly logger = new Logger(SampleService.name);
  private axiosInstance: AxiosInstance;

  constructor(
    private readonly chainRepository: ChainRepository,
    private readonly protocolRepository: ProtocolRepository,
    private readonly stableCoinRepository: StableCoinRepository,
    private readonly yieldPoolRepository: YieldPoolRepository,
    private readonly dexInfoRepository: DexInfoRepository,
    private readonly dexProtocolRepository: DexProtocolRepository,
    private readonly dataSource: DataSource
  ) {
    const baseUrl = `http://localhost:${process.env.API_PORT}`;
    this.axiosInstance = Axios.create({
      baseURL: baseUrl,
    });
  }

  // API 호출
  public async getAPIHealthCheck() {
    const response = await this.axiosInstance.get("/");

    // this.logger.debug(
    //   `[${SampleService.name} / ${this.getAPIHealthCheck.name}] res: `,
    //   response
    // );
    return { status: response.status, data: response.data };
  }
}
