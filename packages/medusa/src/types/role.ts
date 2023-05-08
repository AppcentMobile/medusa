import { Role } from "../models"
import { PartialPick } from "./common"

export interface CreateRoleInput {
  id?: string
  name: string
  permissions: [
    { action: [string]; subject: string; conditions?: Record<string, string> }
  ]
  author_id?: string
}

export interface UpdateRoleInput {
  name?: string
  permissions?: string[]
}

export type selector = {
  name?: string
}

export type FilterableRoleProps = PartialPick<
  Role,
  "name" | "created_at" | "updated_at" | "deleted_at"
>
