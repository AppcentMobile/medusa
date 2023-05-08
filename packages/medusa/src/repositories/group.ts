import { Group } from "../models"
import { dataSource } from "../loaders/database"

export const GroupRepository = dataSource.getRepository(Group)
export default GroupRepository
