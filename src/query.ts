import { MaskF } from "./Mask";
import ECS from "./ECS";
import Entity from "./entity";

type IComponent = { mask: bigint }
interface ICond {
  all?: IComponent[],
  any?: IComponent[],
  not?: IComponent[],
  notAny?: IComponent[],
}
export interface IQuery extends ICond {
  added?: ICond,
  removed?: ICond,
  changed?: ICond,
}

export default class Query {
  ecs: ECS
  _match: ((archetype: bigint) => boolean)

  match() {
    const r = [] as Entity[]
    // console.log(this.ecs.archetypes)
    this.ecs.archetypes.map.forEach((v, k) => {
      if (this._match(k)) {
        v.packedIds.forEach(etIdx => {
          const et = this.ecs.entities.get(etIdx)
          if (et) r.push(et)
          else console.error('Entity not found')
        })
      }
    })
    return r
  }

  constructor(ecs: ECS, q: IQuery) {
    this.ecs = ecs
    this._match = makeMatchFunc(ecs, q)
  }
}

function makeMatchFunc(ecs: ECS, q: IQuery) {
  const len = BigInt(ecs.components.length)
  const fnMaskList = [
    ...makeFnMaskList(q, 0n),
    ...makeFnMaskList(q.added, len * 1n),
    ...makeFnMaskList(q.removed, len * 2n),
    ...makeFnMaskList(q.changed, len * 3n),
  ]
  return (archetype: bigint) => fnMaskList.every(({ fn, mask }) => fn(archetype, mask))
}


function mergeMask(masks?: { mask: bigint }[], shift = 0n) {
  return masks?.reduce((acc, cur) => acc | (cur.mask << shift), 0n) ?? null
}
function makeFnMaskList(cond?: ICond, shift = 0n) {
  return [
    { fn: MaskF.all, mask: mergeMask(cond?.all, shift) },
    { fn: MaskF.any, mask: mergeMask(cond?.any, shift) },
    { fn: MaskF.not, mask: mergeMask(cond?.not, shift) },
    { fn: MaskF.notAny, mask: mergeMask(cond?.notAny, shift) },
  ].filter(({ mask }) => mask !== null) as { fn: (mask: bigint, mask2: bigint) => boolean, mask: bigint }[]
}
