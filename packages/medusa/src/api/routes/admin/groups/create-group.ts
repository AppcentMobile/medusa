// import { IsString, IsNumber, IsOptional } from "class-validator"

// import _ from "lodash"
// import { validator } from "../../../../utils/validator"
// import { EntityManager } from "typeorm"
// import GroupService from "../../../../services/group"

// export default async (req, res) => {
//   const validated = await validator(GroupRequest, req.body)

//   const groupService: GroupService = req.scope.resolve("groupService")
//   const data = _.omit(validated)

//   const manager: EntityManager = req.scope.resolve("manager")
//   const group = await manager.transaction(async (transactionManager) => {
//     return await groupService.withTransaction(transactionManager).create(data)
//   })

//   res.status(200).json({ group })
// }

// export class GroupRequest {
//   @IsString()
//   name: string

//   @IsOptional()
//   @IsString()
//   description?: string

//   @IsNumber()
//   role: number
// }
