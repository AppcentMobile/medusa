import { IsArray, IsNotEmpty, IsString } from "class-validator"

import _ from "lodash"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"
import RoleService from "../../../../services/role"

export default async (req, res) => {
  const validated = await validator(RolePostRequest, req.body)

  const userId: string = req.user.id || req.user.userId

  const roleService: RoleService = req.scope.resolve("roleService")

  const manager: EntityManager = req.scope.resolve("manager")
  const result = await manager.transaction(async (transactionManager) => {
    return await roleService.withTransaction(transactionManager).create({
      name: validated.name,
      permissions: validated.permissions,
      author_id: userId,
    })
  })

  res.status(200).json({ role: result })
}

export class RolePostRequest {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsArray()
  @IsNotEmpty()
  permissions: [
    {
      action: [string]
      subject: string
      conditions?: Record<string, string>
    }
  ]
}
