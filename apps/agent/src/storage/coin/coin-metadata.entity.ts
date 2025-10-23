import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from "typeorm";

@Unique("coin_metadata_unique_owner_per_chain", ["chainId", "ownerAddress"])
@Entity({ name: "coin_metadata" })
export class CoinMetadata {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "integer" })
  chainId!: number;

  @Index("idx_coin_metadata_owner_lower")
  @Column({ type: "varchar", length: 42 })
  ownerAddress!: string; // 0x + 40 hex (소문자 체크섬은 서비스 레벨에서 통일 권장)

  @Column({ type: "varchar", length: 80 })
  name!: string;

  @Column({ type: "varchar", length: 32, nullable: true })
  symbol?: string | null;

  @Column({ type: "text", nullable: true })
  description?: string;

  @Column({ type: "text", nullable: true })
  image?: string | null;

  @Column({ type: "text", nullable: true, name: "banner_image" })
  bannerImage?: string | null;

  @Column({ type: "text", nullable: true, name: "featured_image" })
  featuredImage?: string | null;

  @Column({ type: "text", nullable: true, name: "external_link" })
  externalLink?: string | null;

  @Column({ type: "jsonb", nullable: true })
  collaborators?: string[] | null;

  @Column({ type: "jsonb", nullable: true })
  properties?: Record<string, any>;

  @CreateDateColumn({ type: "timestamptz", name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamptz", name: "updated_at" })
  updatedAt!: Date;
}
