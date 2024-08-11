export class SparseSet {
  packedIds: number[] = []
  #sparse: number[] = []

  has(id: number) {
    return this.#sparse[id] < this.packedIds.length && this.packedIds[this.#sparse[id]] === id
  }

  add(id: number) {
    if (this.has(id)) {
      throw new Error(`id already exists: ${id}`)
    }
    this.#sparse[id] = this.packedIds.length
    this.packedIds.push(id)
  }

  remove(id: number) {
    if (!this.has(id)) {
      throw new Error(`id does not exist: ${id}`)
    }
    const last = this.packedIds.pop()!
    if (id !== last) {
      this.#sparse[last] = this.#sparse[id]
      this.packedIds[this.#sparse[id]] = last
    }
  }
}

export class SparseSetAutoAllocable {
  sset = new SparseSet()
  packedIds = this.sset.packedIds
  releasedIds: number[] = []
  has(id: number) {
    return this.sset.has(id)
  }
  alloc() {
    const id = this.releasedIds.length > 0
      ? this.releasedIds.pop()!
      : this.sset.packedIds.length
    this.sset.add(id)

    return id
  }
  release(id: number) {
    this.sset.remove(id)
    this.releasedIds.push(id)
  }
}