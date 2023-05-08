import RoleService from "../../../../services/role"

export default async (req, res) => {
  const { id } = req.params

  const roleService: RoleService = req.scope.resolve("roleService")
  const role = await roleService.retrieve(id)

  res.status(200).json({ role })
}
