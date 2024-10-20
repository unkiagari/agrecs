import ECS from "./ECS.ts";
import Entity from "./entity.ts";

const enum OPERAND { ALL, ANY, NOT_ALL, NOT_ANY }
type IComponent = { mask: bigint }

export type Query =
  { all: (Query | IComponent)[] }
  | { any: (Query | IComponent)[] }
  | { notAll: (Query | IComponent)[] }
  | { notAny: (Query | IComponent)[] }
export type ParsedQuery = {
  op: OPERAND,
  archetype: bigint,
  queries: ParsedQuery[]
}

export class QueryV2 {
  parsedQuery: ParsedQuery
  constructor(private ecs: ECS, q: Query) {
    this.parsedQuery = parseQuery(q)
  }

  match() {
    const r = [] as Entity[]
    this.ecs.archetypes.map.forEach((v, k) => {
      if (match(k, this.parsedQuery)) {
        v.packedIds.forEach(etIdx => {
          const et = this.ecs.entities.get(etIdx)
          if (et) r.push(et)
          else console.error('Entity not found')
        })
      }
    })
    return r
  }
}

function parseQuery(q: Query): ParsedQuery {
  let op = OPERAND.ALL
  let items = Object.values(q)[0]
  if ('all' in q) op = OPERAND.ALL
  if ('any' in q) op = OPERAND.ANY
  if ('notAll' in q) op = OPERAND.NOT_ALL
  if ('notAny' in q) op = OPERAND.NOT_ANY

  const queries = [] as ParsedQuery[]

  let archetype = 0n
  items.forEach(item => {
    if ('mask' in item) archetype |= item.mask
    else queries.push(parseQuery(item))
  })

  return { op, archetype, queries }
}

function match(archetype: bigint, rule: ParsedQuery): boolean {
  if (rule.op === OPERAND.ALL) {
    if ((archetype & rule.archetype) < rule.archetype) {
      return false
    }
    return rule.queries.every(rule => match(archetype, rule))
  }
  if (rule.op === OPERAND.ANY) {
    if ((archetype & rule.archetype) === 0n) {
      return false
    }
    return rule.queries.some(rule => match(archetype, rule))
  }
  if (rule.op === OPERAND.NOT_ALL) {
    if ((archetype & rule.archetype) === rule.archetype) {
      return false
    }
    return !rule.queries.every(rule => match(archetype, rule))
  }
  if (rule.op === OPERAND.NOT_ANY) {
    if ((archetype & rule.archetype) > 0n) {
      return false
    }
    return !rule.queries.some(rule => match(archetype, rule))
  }

  return true
}