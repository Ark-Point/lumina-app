import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from "typeorm";

export type DeploymentStatus = "pending" | "success" | "failed";

@Entity({ name: "coin_deployments" })
export class CoinDeployment {
  @PrimaryGeneratedColumn("increment", { type: "bigint" })
  id!: string;

  @Column({ type: "integer" })
  chainId!: number;

  @Index("idx_coin_deploy_owner_lower")
  @Column({ type: "varchar", length: 42 })
  ownerAddress!: string;

  @Column({ type: "varchar", length: 66 })
  txHash!: string;

  @Index("idx_coin_deploy_coinaddr")
  @Column({ type: "varchar", length: 42 })
  coinAddress!: string;

  @Column({ type: "varchar", length: 32 })
  factory!: "zora-factory" | "oz-erc20";

  @Column({ type: "varchar", length: 80, nullable: true })
  name?: string | null;

  @Index("idx_coin_deploy_symbol")
  @Column({ type: "varchar", length: 32, nullable: true })
  symbol?: string | null;

  @Index("idx_coin_deploy_status")
  @Column({ type: "varchar", length: 16, default: "pending" })
  status!: DeploymentStatus;

  @Column({ type: "text", nullable: true })
  errorMessage?: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;

  @Column({ type: "timestamptz", name: "confirmed_at", nullable: true })
  confirmedAt?: Date;
}
