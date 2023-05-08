import { EntityManager, IsNull, Not } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import EventBusService from "./event-bus"
import GroupRepository from "../repositories/group"
import { Group } from "../models"
import { MedusaError, isDefined } from "medusa-core-utils"
import { CreateGroupInput } from "../types/group"
import { FindConfig, Selector } from "../types/common"
import { buildQuery } from "../utils"

type GroupServiceProps = {
  groupRepository: typeof GroupRepository
  manager: EntityManager
  eventBusService: EventBusService
}

/**
 * Provides layer to manipulate groups.
 */
class GroupService extends TransactionBaseService {
  static readonly Events = {
    CREATED: "group.created",
    UPDATED: "group.updated",
    DELETED: "group.deleted",
  }

  protected readonly groupRepository_: typeof GroupRepository
  protected readonly eventBus_: EventBusService

  constructor({ groupRepository, eventBusService }: GroupServiceProps) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.groupRepository_ = groupRepository
    this.eventBus_ = eventBusService
  }

  /**
   * Retrieves a specific group.
   * @param groupId - the id of the group to retrieve.
   * @param config - any options needed to query for the result.
   * @return which resolves to the requested group.
   */
  async retrieve(
    groupId: string,
    config: FindConfig<Group> = {}
  ): Promise<Group | never> {
    if (!isDefined(groupId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"groupId" must be defined`
      )
    }

    const groupRepo = this.activeManager_.withRepository(this.groupRepository_)

    const query = buildQuery({ id: groupId }, config)

    const group = await groupRepo.findOne(query)

    if (!group) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Group with id: ${groupId} was not found.`
      )
    }

    return group
  }

  /**
   * Fetch all groups related to given selector
   * @param selector - the selector to use when fetching groups
   * @param config - any options needed to query for the result.
   * @return which resolves to the requested groups.
   */
  async list(
    selector: Selector<Group>,
    config: FindConfig<Group> = {
      skip: 0,
      take: 50,
      relations: [],
    }
  ): Promise<Group[]> {
    const groupRepo = this.activeManager_.withRepository(this.groupRepository_)

    const query = buildQuery(selector, config)

    const groups = await groupRepo.find(query)

    return groups
  }

  // /**
  //  * Creates a group.
  //  * @param data - the data to use when creating the group.
  //  * @param config - any options needed to query for the result.
  //  * @return which resolves to the created group.
  //  */
  // async create(
  //   data: CreateGroupInput,
  //   config: { metadata: Record<string, unknown> } = { metadata: {} }
  // ): Promise<Group> {
  //   const { metadata } = config

  //   const { name, role, description, id, users } = data

  //   return await this.atomicPhase_(async (manager) => {
  //     const groupRepo = manager.withRepository(this.groupRepository_)

  //     const toCreate = {
  //       id,
  //       name,
  //       role,
  //       description,
  //       metadata,
  //       users,
  //     }

  //     const group = groupRepo.create(toCreate)
  //     const result = await groupRepo.save(group)

  //     await this.eventBus_
  //       .withTransaction(manager)
  //       .emit(GroupService.Events.CREATED, { id: group.id })

  //     return result
  //   })
  // }
}

export default GroupService
