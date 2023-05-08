import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm"

import { Role } from "./role"
import { User } from "./user"
import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"

@Entity({ name: "groups", schema: "public" })
export class Group extends SoftDeletableEntity {
  @Column()
  name: string

  @Column()
  description: string

  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id" })
  roleId: Role

  @ManyToMany(() => User)
  @JoinTable({
    name: "group_users",
    joinColumn: {
      name: "group_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id",
    },
  })
  users: User[]

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "grp")
  }
}
