import { Group } from "../models"
import { PartialPick } from "./common"

export interface CreateGroupInput {
  id?: string
  name: string
  description?: string
  role: number
  users?: string[]
}

export interface UpdateGroupInput {
  name?: string
  description?: string
  role?: number
}

export type FilterableGroupProps = PartialPick<
  Group,
  "name" | "description" | "created_at" | "updated_at" | "deleted_at"
>
