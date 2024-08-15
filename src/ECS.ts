import { ObjectPool } from "./ObjectPool";
import ArcheTypes from "./archetypes";
import { IComponent } from "./Component";
import Entity from "./entity";
import Query from "./query";
import { IQuery } from "./query";
import { System } from "./System";

export default class ECS {
  archetypes = new ArcheTypes()
  entities = new ObjectPool((index: number) => new Entity(this, index))
  globalEntity = null as any as Entity

  pendingEntitiesToUpdateArchetype = new Set<Entity>()
  pendingEntitiesToRemove = new Set<Entity>()

  components = [] as IComponent[]
  systems = [] as System[]

  totalTime = 0

  registerComponent(component: IComponent) {
    component.id = this.components.length
    component.mask = 1n << BigInt(component.id)
    this.components.push(component)
    return this
  }
  registerSystem(system: (new (ecs: ECS) => System)) {
    this.systems.push(new system(this))
    return this
  }
  setup() {
    this.components.forEach((component) => {
      const len = this.components.length
      component.mask = 1n << BigInt(component.id)
      component.changedMask = component.mask << BigInt(len)
      component.addedMask = component.mask << BigInt(len * 2)
      component.removedMask = component.mask << BigInt(len * 3)
    })

    this.globalEntity = this.createEntity()

    this.components
      .filter(v => v.options.global)
      .forEach((component) => {
        console.log("add global component", component)
        this.globalEntity.add(component)
      })

    this.systems.forEach((system) => system.g = this.globalEntity)


    this.systems.forEach((system) => system.initialize())

    return this
  }

  createEntity() {
    const et = this.entities.alloc()
    et.generaton++
    et.id = (BigInt(et.index) << 32n) | et.generaton
    et.maskForArcheType = 0n
    et.mask.value = 0n
    this.archetypes._add(et)
    return et
  }
  getEntity(id: bigint) {
    const index = id >> 32n
    const generation = id & 0xffffffffn
    const et = this.entities.get(Number(index))
    return et?.generaton === generation
      ? et
      : null
  }
  getSystem(system: typeof System) {
    return this.systems.find((s) => s instanceof system)
  }
  _getEntityByIndex(index: number) {
    return this.entities.get(index)
  }

  removePendingEntities() {
    this.pendingEntitiesToRemove
      .forEach(et => et.removeEntity(false))
  }

  query(q: IQuery) {
    return new Query(this, q)
  }

  updateArchetypeOfPendingEntities() {
    this.pendingEntitiesToUpdateArchetype.forEach(et => {
      this.archetypes.update(et)
    })
    this.archetypes.applyPending()
    this.pendingEntitiesToUpdateArchetype.clear()
  }

  tick(deltaTime: number) {
    this.totalTime += deltaTime
    this.systems.forEach((system) => {
      if (system.disabled) return
      this.updateArchetypeOfPendingEntities()
      system.exec(deltaTime, this.totalTime)
    })
    this.entities.forEach((et) => et.resetForSystemLoopEnd())

  }

  run() {
    let lastTime = 0
    const loop = (timestamp: number) => {
      const deltaTime = timestamp - lastTime
      lastTime = timestamp
      this.tick(deltaTime)
      requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)

    return this
  }
}
