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

    archetype.remove(et.index)
    if (archetype.packedIds.length === 0) {
      archetypes.delete(et.maskForArcheType)
    }
  }
  _add(et: Entity) {
    const archetypes = this.map
    const mask = et.mask.value
    et.maskForArcheType = mask
    let archetype = archetypes.get(mask)
    if (!archetype) {
      archetype = new SparseSet()
      archetypes.set(mask, archetype)
    }
    archetype.add(et.index)
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
