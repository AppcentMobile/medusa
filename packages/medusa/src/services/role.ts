import { EntityManager, IsNull, Not } from "typeorm"

import RoleRepository from "../repositories/role"
import { TransactionBaseService } from "../interfaces"
import EventBusService from "./event-bus"
import { Role } from "../models"
import { MedusaError, isDefined } from "medusa-core-utils"
import { CreateRoleInput } from "../types/role"
import { FindConfig, Selector } from "../types/common"
import { buildQuery } from "../utils"

type RoleServiceProps = {
  roleRepository: typeof RoleRepository
  manager: EntityManager
  eventBusService: EventBusService
}

class RoleService extends TransactionBaseService {
  static readonly Events = {
    CREATED: "role.created",
    UPDATED: "role.updated",
    DELETED: "role.deleted",
  }

  protected readonly roleRepository_: typeof RoleRepository
  protected readonly eventBus_: EventBusService

  constructor({ roleRepository, eventBusService }: RoleServiceProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.roleRepository_ = roleRepository
    this.eventBus_ = eventBusService
  }

  /**
   * Retrieves a specific role.
   * @param roleId - the id of the role to retrieve.
   * @param config - any options needed to query for the result.
   * @return which resolves to the requested role.
   */
  async retrieve(
    roleId: string,
    config: FindConfig<Role> = {}
  ): Promise<Role | never> {
    if (!isDefined(roleId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"roleId" must be defined`
      )
    }

    const roleRepo = this.activeManager_.withRepository(this.roleRepository_)

    const query = buildQuery({ id: roleId }, config)

    const role = await roleRepo.findOne(query)

    if (!role) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Role with id: ${roleId} was not found`
      )
    }

    return role
  }

  /**
   * Fetch all roles related to the given selector
   * @param selector - the selector to use when fetching roles
   * @param config - the config to use when fetching roles
   * @returns the result of the query
   */
  async list(
    selector: Selector<Role>,
    config: FindConfig<Role> = {
      skip: 0,
      take: 50,
      relations: [],
    }
  ): Promise<Role[]> {
    const roleRepo = this.activeManager_.withRepository(this.roleRepository_)

    const query = buildQuery(selector, config)

    return await roleRepo.find(query)
  }

  /**
   * Creates a note associated with a given author
   * @param data - the note to create
   * @param config - any configurations if needed, including meta data
   * @return resolves to the creation result
   */
  async create(
    data: CreateRoleInput,
    config: { metadata: Record<string, unknown> } = { metadata: {} }
  ): Promise<Role> {
    const { metadata } = config

    const { name, permissions, author_id } = data

    //! if author_id is "admin" or not check...

    return await this.atomicPhase_(async (manager) => {
      const roleRepo = manager.withRepository(this.roleRepository_)

      const toCreate = {
        name,
        ...permissions,
      }

      const role = roleRepo.create(toCreate)
      const result = await roleRepo.save(role)

      await this.eventBus_
        .withTransaction(manager)
        .emit(RoleService.Events.CREATED, { id: result.id })

      return result
    })
  }

  /**
   * Updates a given role with the given data
   * @param roleId - the id of the role to update
   * @param value - the data to update the role with
   * @return resolves to the updated role
   */
  async update(
    roleId: string,
    data: { name: string; permission: [] }
  ): Promise<Role> {
    return await this.atomicPhase_(async (manager) => {
      const roleRepo = manager.withRepository(this.roleRepository_)

      const role = await this.retrieve(roleId)

      const toUpdate = {
        ...role,
        ...data,
      }

      const result = await roleRepo.save(toUpdate)

      await this.eventBus_
        .withTransaction(manager)
        .emit(RoleService.Events.UPDATED, { id: result.id })

      return result
    })
  }

  /**
   * Deletes a given role
   * @param roleId - the id of the role to delete
   */
  async delete(roleId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const roleRepo = manager.withRepository(this.roleRepository_)

      const role = await this.retrieve(roleId)

      await roleRepo.softRemove(role)

      await this.eventBus_
        .withTransaction(manager)
        .emit(RoleService.Events.DELETED, { id: roleId })
    })
  }
}

export default RoleService
