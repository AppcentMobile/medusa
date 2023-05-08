import { Role } from "../models"
import { dataSource } from "../loaders/database"

export const RoleRepository = dataSource.getRepository(Role)
export default RoleRepository
