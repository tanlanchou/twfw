import { Entity, PrimaryColumn, Column } from "typeorm";
import { v4 as uuidv4 } from "uuid";

@Entity("Users")
export class User {
  @PrimaryColumn("char", {
    length: 36,
    default: () => `replace(uuid(), '-', '')`,
  })
  ID: string = uuidv4().replace(/-/g, "");

  @Column({ type: "varchar", length: 255, nullable: false })
  Nickname: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  Email: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  PhoneNumber: string | null;

  @Column({ type: "datetime", nullable: false })
  RegistrationDate: Date;

  @Column({ type: "datetime", nullable: false })
  LastLoginTime: Date;

  @Column({ type: "tinyint", nullable: false, default: 1 })
  Status: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  Password: string;

  @Column({
    type: "varchar",
    length: 45,
    nullable: true,
    charset: "utf8mb4",
    collation: "utf8mb4_0900_ai_ci",
  })
  IPAddress: string | null;
}
