import Entity from "./entity"
import { SparseSet } from "./sparseset"

export default class ArcheTypes {
  pending = new Set<Entity>()

  /** bitsetとentityIndexのマップ */
  map = new Map<bigint, SparseSet>()

  _remove(et: Entity) {
    const archetypes = this.map

    const archetype = archetypes.get(et.maskForArcheType)
    if (!archetype) return

    // console.log("remove archetype", et.maskForArcheType)
    archetype.remove(et.index)
    if (archetype.packedIds.length === 0) {
      archetypes.delete(et.mask.value)
    }
  }
  _add(et: Entity) {
    const archetypes = this.map
    const mask = et.mask.value
    let entityIdxes = archetypes.get(mask)
    // console.log("add mask", mask)
    if (!entityIdxes) {
      entityIdxes = new SparseSet()
      archetypes.set(mask, entityIdxes)
    }
    entityIdxes.add(et.index)
  }
  update(et: Entity) {
    this._remove(et)
    this._add(et)
    et.maskForArcheType = et.mask.value
  }
  addPending(et: Entity) {
    this.pending.add(et)
  }
  applyPending() {
    this.pending.forEach(et => {
      this._remove(et)
      this._add(et)
    })
    this.pending.clear()
  }
}
