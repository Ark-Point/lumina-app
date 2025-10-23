import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { CoinMetadata } from "./coin-metadata.entity";

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

  @Index("idx_coin_deploy_status")
  @Column({ type: "varchar", length: 16, default: "pending" })
  status!: DeploymentStatus;

  @Column({ type: "text", nullable: true })
  errorMessage?: string;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;

  @Column({ type: "timestamptz", name: "confirmed_at", nullable: true })
  confirmedAt?: Date;

  /** Optional: 메타데이터 관계 (체인+오너) */
  @ManyToOne(() => CoinMetadata, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
    nullable: false,
  })
  @JoinColumn([
    { name: "chain_id", referencedColumnName: "chainId" as any },
    { name: "owner_address", referencedColumnName: "ownerAddress" as any },
  ])
  metadata!: CoinMetadata;
}
