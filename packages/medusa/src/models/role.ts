import { BeforeInsert, Column, Entity } from "typeorm"
import { SoftDeletableEntity } from "../interfaces"
import { generateEntityId } from "../utils"

@Entity()
export class Role extends SoftDeletableEntity {
  @Column()
  name: string

  @Column({
    type: "jsonb",
    array: false,
    default: () => "'[]'",
    nullable: false,
  })
  permissions: Array<{
    action: [string]
    subject: string
    conditions: Array<{ [key: string]: any }>
  }>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "rol")
  }
}
