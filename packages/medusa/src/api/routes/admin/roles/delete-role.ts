import { EntityManager } from "typeorm"
import RoleService from "../../../../services/role"

export default async (req, res) => {
  const { id } = req.params

  const roleService: RoleService = req.scope.resolve("roleService")
  const manager: EntityManager = req.scope.resolve("manager")
  const role = await manager.transaction(async (transactionManager) => {
    return await roleService.withTransaction(transactionManager).delete(id)
  })

  res.status(200).json({ role })
}
