import { Ability, RawRuleOf, ForcedSubject, MongoQuery } from "@casl/ability"

export const actions = ["manage", "create", "read", "update", "delete"] as const
export const subjects = [
  "Article",
  "Role",
  "Member",
  "Group",
  "Product",
  "all",
] as const

export type Abilities = [
  typeof actions[number],
  (
    | typeof subjects[number]
    | ForcedSubject<Exclude<typeof subjects[number], "all">>
  )
]
export type Conditions = MongoQuery

export type AppAbility = Ability<Abilities>
// export const createAbility = (rules: RawRuleOf<AppAbility>[]) => new Ability<Abilities>(rules);

export class AppAbilityFactory {
  // *product*
  async defineAbilitiesForRole(rules: RawRuleOf<AppAbility>[]) {
    const ability = new Ability<Abilities, Conditions>(rules)
    return ability
  }
}
