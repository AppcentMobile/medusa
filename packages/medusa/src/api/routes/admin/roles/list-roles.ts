import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator"

import _ from "lodash"
import { validator } from "../../../../utils/validator"
import { EntityManager } from "typeorm"
import RoleService from "../../../../services/role"
import { Type } from "class-transformer"
import { selector } from "../../../../types/role"

export default async (req, res) => {
  // const validated = await validator(AdminGetRolesReq, req.body)

  // const selector: selector = {}

  // if (validated.name) {
  //   selector.name = validated.name
  // }

  const roleService: RoleService = req.scope.resolve("roleService")
  const roles = await roleService.list(
    {},
    {
      take: 50,
      skip: 0,
      relations: ["permissions"],
    }
  )
}

export class AdminGetRolesReq {
  @IsString()
  name: string

  @IsArray()
  permissions: string[]

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit = 50

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset = 0
}
