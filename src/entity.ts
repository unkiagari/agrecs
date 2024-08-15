import Mask from "./Mask"
import { IComponent } from "./Component"
import ECS from "./ECS"
import { SparseSet } from "./sparseset"

export default class Entity {
  ecs: ECS
  _objectPoolIndex: number
  index: number
  generaton = 0n
  id = 0n

  /** 
   * 現在ArcheTypesに設定されているマスク\
   * pendingに使用される
   */
  maskForArcheType = 0n
  mask = new Mask // current, changed, added, removed

  /**
   * 登録されているコンポーネントの実体\
   * componentInstances[component.id]
   */
  #componentInstances: any[] = []

  /** 登録されているコンポーネントIDのリスト */
  usedComponentIds = new SparseSet
  removeRequestedComponentIds = new SparseSet

  constructor(ecs: ECS, index: number) {
    this.ecs = ecs
    this._objectPoolIndex = index
    this.index = index
    this.#componentInstances = Array.from({ length: ecs.components.length }, () => null)
  }

  add<T>(component: IComponent<T>) {
    const componentInstance = component.pool.pop() ?? component.make(this.ecs)
    this.#componentInstances[component.id] = componentInstance
    this.mask.add(component.mask)
    this.mask.add(component.addedMask)
    this.ecs.pendingEntitiesToUpdateArchetype.add(this)

    this.usedComponentIds.add(component.id)
    console.log("mask", this.mask)

    return componentInstance
  }

  remove(component: IComponent, defered = false) {
    if (defered) {
      this.mask.add(component.removedMask)
      this.removeRequestedComponentIds.add
        (component.id)
      this.ecs.pendingEntitiesToUpdateArchetype.add(this)
    } else {
      this.mask.remove(component.mask)
      this.mask.remove(component.removedMask)
      this.ecs.pendingEntitiesToUpdateArchetype.add(this)
      const _cmp = this.#componentInstances[component.id]
      this.#componentInstances[component.id] = null
      this.ecs.components[component.id].pool.push(_cmp)
      if (this.removeRequestedComponentIds.has(component.id)) {
        this.removeRequestedComponentIds.remove(component.id)
      }
      this.usedComponentIds.remove(component.id)
    }
    return this
  }
  removeAll(defered = false) {
    this.usedComponentIds.packedIds.forEach(id => {
      const componentSchema = this.ecs.components[id]
      this.remove(componentSchema, defered)
    })
  }

  has(component: IComponent) {
    console.log(component.mask, this.mask.value)
    return this.mask.has(component.mask)
  }

  read<T>(component: IComponent<T>) {
    if (this.#componentInstances[component.id] === null) throw new Error('Component not found')
    return this.#componentInstances[component.id] as T
  }
  write<T>(component: IComponent<T>) {
    this.mask.add(component.changedMask)
    return this.#componentInstances[component.id] as T
  }

  removeEntity(defered = false) {
    if (defered) {
      this.ecs.pendingEntitiesToRemove.add(this)
    } else {
      this.ecs.archetypes._remove(this)
      this.ecs.entities.release(this)
      this.mask.clear()
    }
  }

  resetForSystemLoopEnd() {
    // changed added removedのマスクを初期化 
    this.mask.value &= (1n << BigInt(this.ecs.components.length)) - 1n

    // 削除予定のコンポーネントの削除
    this.removeRequestedComponentIds.packedIds.forEach(id => {
      this.removeRequestedComponentIds.remove(id)
      this.remove(this.ecs.components[id], false)
    })
  }

  clean() {
    this.removeAll(false)
    this.mask.clear()
    this.#componentInstances.length = 0
  }
}

