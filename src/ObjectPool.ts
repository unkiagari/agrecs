import {SparseSetAutoAllocable} from "./sparseset"

/** IdPoolを継承したPool\
 * プールするオブジェクトのメンバ変数に _objectPoolIndex を追加する必要がある
 */
export class ObjectPool<T extends { _objectPoolIndex: number }> {
  idPool = new SparseSetAutoAllocable()
  items = [] as T[]

  constructor(private objFactory: (id: number) => T) {
  }

  alloc() {
    const id = this.idPool.alloc()
    if (!this.items[id]) {
      const obj = this.objFactory(id)
      obj._objectPoolIndex = id
      this.items[id] = obj
    }
    return this.items[id]
  }
  release(item: T) {
    this.idPool.release(item._objectPoolIndex)
    // this.items[item._objectPoolIndex] = item
  }

  get(id: number) {
    return this.items[id]
  }

  forEach(callback: (v: T, i: number) => void) {
    const ids = this.idPool.packedIds
    for (let i = 0; i < ids.length; i++) {
      const idx = ids[i]
      callback(this.items[idx], i)
    }
  }
  find(callback: (v: T, i: number) => boolean) {
    const ids = this.idPool.packedIds
    for (let i = 0; i < ids.length; i++) {
      const idx = ids[i]
      if (callback(this.items[idx], i)) return this.items[idx]
    }
    return null
  }

  length() {
    return this.idPool.packedIds.length
  }
}
