import { IsArray, IsNotEmpty, IsString } from "class-validator"

import _ from "lodash"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"
import RoleService from "../../../../services/role"

export default async (req, res) => {
  const { id } = req.params

  const validated = await validator(AdminUpdateRoleReq, req.body)

  const roleService: RoleService = req.scope.resolve("roleService")
  const manager: EntityManager = req.scope.resolve("manager")
  // const role = await manager.transaction(async (transactionManager) => {
  //   return await roleService.withTransaction(transactionManager).update(id, {
  //     name: validated.name,
  //     permissions: validated.permissions,
  //   })
  // }

  res.status(200).json()
}

export class AdminUpdateRoleReq {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsArray()
  @IsNotEmpty()
  permissions: string[]
}
